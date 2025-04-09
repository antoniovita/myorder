import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; 

export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { tableId } = body;

        if (!tableId) {
            return NextResponse.json({ message: "tableId é obrigatório." }, { status: 400 });
        }

        const deletedUsers = await prisma.user.deleteMany({
            where: { tableId },
        });

        return NextResponse.json({
            message: "Todos os usuários da mesa foram apagados com sucesso.",
            count: deletedUsers.count,
        });

    } catch (error) {
        console.error("Erro ao limpar a mesa.", error);
        return NextResponse.json({ message: "Erro ao limpar mesa." }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID é obrigatório." }, { status: 400 });
        }

        const existingOrder = await prisma.order.findUnique({ where: { id } });

        if (!existingOrder) {
            return NextResponse.json({ message: "Pedido não encontrado." }, { status: 404 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status: "finalizado" },
        });

        return NextResponse.json({
            message: "Pedido atualizado com sucesso!",
            order: updatedOrder
        }, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar pedido:", error);
        return NextResponse.json({ message: "Erro ao atualizar pedido." }, { status: 500 });
    }
};
