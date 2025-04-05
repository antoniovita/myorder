import { NextRequest, NextResponse } from "next/server";
import authenticate from "@/middlewares/authMiddleware";
import { prisma } from "../../../lib/prisma"; 
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const POST = async (req: NextRequest) => {
    try {
        if (!process.env.JWT_SECRET) {
            return NextResponse.json({ message: "Chave JWT_SECRET não informada no .env" }, { status: 500 });
        }

        const body = await req.json();
        const { name, tableNumber, providerId } = body;

        if (!name || !tableNumber || !providerId) {
            return NextResponse.json({ message: 'O nome, número da mesa e providerId são obrigatórios.' }, { status: 400 });
        }

        const table = await prisma.table.findFirst({
            where: {
                number: tableNumber,
                providerId: providerId
            },
        });

        if (!table) {
            return NextResponse.json({ message: 'Mesa não encontrada.' }, { status: 404 });
        }

        let user = await prisma.user.findFirst({
            where: {
                name,
                tableId: table.id,
                providerId
            }
        });

        const created = !user;

        if (created) {
            user = await prisma.user.create({
                data: {
                    name,
                    tableId: table.id,
                    providerId,
                }
            });
        }

        if (!user) {
            return NextResponse.json({ message: 'Erro ao criar ou autenticar o usuário.' }, { status: 500 });
        }

        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const cookiesStore = await cookies();
        cookiesStore.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 3600 });
        cookiesStore.set("id", user.id, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 3600 });

        return NextResponse.json(
            { message: created ? 'Usuário criado com sucesso!' : 'Login realizado com sucesso!', user },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erro ao criar o usuário.' }, { status: 500 });
    }
};


const GET = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);

        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            where: { providerId: auth.id }, 
            include: { table: true, order: true }, 
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erro ao obter dados dos usuários.' }, { status: 500 });
    }
};

const PUT = async (req: NextRequest) => {
    try {
        const body = await req.json();

        if (!body.providerId || !body.userId || !body.newTableNumber) {
            return NextResponse.json({ message: 'É necessário preencher todos os campos: providerId, userId e newTableNumber.' }, { status: 400 });
        }
    
        const newTable = await prisma.table.findFirst({
            where: { providerId: body.providerId, number: body.newTableNumber }
        });
        if (!newTable) {
            return NextResponse.json({ message: 'Nova mesa não encontrada.' }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: body.userId },
            data: { tableId: newTable.id }
        });

        return NextResponse.json({ message: 'Usuário movido para nova mesa com sucesso!', updatedUser }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erro ao atualizar a mesa do usuário.' }, { status: 500 });
    }
};

export { POST, GET, PUT };
