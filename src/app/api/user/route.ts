import { NextRequest, NextResponse } from "next/server";
import authenticate from "@/middlewares/authMiddleware";
import { prisma } from "../../../lib/prisma"; 
import { table } from "console";

const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        if (!body.name || !body.tableNumber) {
            return NextResponse.json({ message: 'O nome e o número da mesa são obrigatórios.' }, { status: 400 });
        }

        const table = await prisma.table.findUnique({
            where: { number: body.tableNumber },  // Procurando pela mesa com esse número
        });

        if (!table) {
            return NextResponse.json({ message: 'Mesa não encontrada.' }, { status: 404 });
        }

        const user = await prisma.user.create({
            data: {
                name: body.name,
                tableId: table.id,
            }
        });

        return NextResponse.json({ message: 'Usuário criado com sucesso!', user }, { status: 201 });
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

export { POST, GET };
