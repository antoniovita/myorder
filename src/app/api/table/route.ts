import { NextRequest, NextResponse } from "next/server";
import authenticate from "@/middlewares/authMiddleware";
import { prisma } from "../../../lib/prisma"; 

const POST = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);

        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }

        const body = await req.json();
        if (!body.number) {
            return NextResponse.json({ message: "O número da mesa é obrigatório." }, { status: 400 });
        }
        
        const existingTable = await prisma.table.findFirst({
            where: {
                providerId: auth.id,
                number: body.number
            }
        });

        if (existingTable) {
            return NextResponse.json({ message: "Esse número de mesa já está em uso no seu restaurante." }, { status: 400 });
        }

        const table = await prisma.table.create({
            data: {
                number: body.number,
                providerId: auth.id,
            }
        });

        return NextResponse.json({ message: "Mesa criada com sucesso!", table }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erro ao criar a mesa." }, { status: 500 });
    }
};

const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const auth = await authenticate(req);

        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }

        if (id) {
            const table = await prisma.table.findUnique({
                where: { id },
                include: { 
                    user: true,
                    order: true 
                }, 
            });

            if (!table) {
                return NextResponse.json({ message: "Mesa não encontrada." }, { status: 404 });
            }

            return NextResponse.json(table, { status: 200 });
        }

        const tables = await prisma.table.findMany({
            where: { providerId: auth.id },
            include: { user: true, order: true }, 
        });

        return NextResponse.json(tables, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erro ao obter as mesas." }, { status: 500 });
    }
};

// alterar numero da mesa
const PUT = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);
        
        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }

        const body = await req.json();
        if (!body.id || !body.newNumber) {
            return NextResponse.json({ message: "ID da mesa e novo número são obrigatórios." }, { status: 400 });
        }

        const table = await prisma.table.findUnique({ where: { id: body.id } });

        if (!table || table.providerId !== auth.id) {
            return NextResponse.json({ message: "Mesa não encontrada ou não pertence ao seu restaurante." }, { status: 404 });
        }

        const existingTable = await prisma.table.findUnique({
            where: {
                providerId: auth.id,
                number: body.newNumber
            }
        });
        if (existingTable) {
            return NextResponse.json({ message: "Já existe uma mesa com esse número no seu restaurante." }, { status: 400 });
        }

        const updatedTable = await prisma.table.update({
            where: { id: body.id },
            data: { number: body.newNumber }
        });

        return NextResponse.json({ message: "Mesa atualizada com sucesso!", updatedTable }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erro ao atualizar a mesa." }, { status: 500 });
    }
};

// apagar uma mesa
const DELETE = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);

        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID da mesa é obrigatório." }, { status: 400 });
        }

        const table = await prisma.table.findUnique({ where: { id } });

        if (!table || table.providerId !== auth.id) {
            return NextResponse.json({ message: "Mesa não encontrada ou não pertence ao seu restaurante." }, { status: 404 });
        }

        await prisma.table.delete({ where: { id } });

        return NextResponse.json({ message: "Mesa deletada com sucesso!" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erro ao deletar a mesa." }, { status: 500 });
    }
};

export { POST, GET, PUT, DELETE };
