import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import authenticate from "@/middlewares/authMiddleware";

const prisma = new PrismaClient();

const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        if (!body.name || !body.table) {
            return NextResponse.json({ message: 'O nome e a table são obrigatórios.' }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                name: body.name,
                table: body.table,
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
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        // Se id for fornecido, busque um único usuário
        if (id) {
            const user = await prisma.user.findUnique({
                where: { id },
                include: { table: true, include: { order: true } },
            });

            if (!user) {
                return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
            }

            return NextResponse.json(user, { status: 200 });
        } else {
            // Caso não haja id, busque todos os usuários (considerando a autenticação)
            const userId = await authenticate(req); // Obtendo o id do usuário autenticado
            if (!userId) {
                return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401 });
            }

            const users = await prisma.user.findMany({
                where: { providerId: userId },
                include: { table: true }, // Inclui a tabela relacionada
            });

            return NextResponse.json(users, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erro ao obter dados do usuário.' }, { status: 500 });
    }
};

export { POST, GET };
