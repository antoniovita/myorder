import { NextRequest, NextResponse } from "next/server";
import authenticate from "@/middlewares/authMiddleware";
import { prisma } from "../../../lib/prisma";

const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return NextResponse.json({ message: "O ID do pedido é obrigatório." }, { status: 400 });
        }

        const orderItems = await prisma.orderItem.findMany({
            where: { orderId },
            include: { item: true }, 
        });

        return NextResponse.json(orderItems, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erro ao obter os itens do pedido." }, { status: 500 });
    }
};

const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { orderId, itemId, quantity } = body;

        if (!orderId || !itemId || !quantity || quantity <= 0) {
            return NextResponse.json({ message: "Todos os campos são obrigatórios e a quantidade deve ser maior que 0." }, { status: 400 });
        }

        const orderItem = await prisma.orderItem.create({
            data: { orderId, itemId, quantity },
        });

        return NextResponse.json({ message: "Item adicionado ao pedido com sucesso!", orderItem }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erro ao adicionar item ao pedido." }, { status: 500 });
    }
};

const DELETE = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "O ID do item é obrigatório." }, { status: 400 });
        }

        await prisma.orderItem.delete({ where: { id } });

        return NextResponse.json({ message: "Item removido com sucesso." }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erro ao remover item do pedido." }, { status: 500 });
    }
};

export { GET, POST, DELETE };
