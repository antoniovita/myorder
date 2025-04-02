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
        const { orderId, itemId, quantity, observation } = body;

        if (!orderId || !itemId || !quantity || quantity <= 0) {
            return NextResponse.json({ message: "Todos os campos são obrigatórios e a quantidade deve ser maior que 0." }, { status: 400 });
        }

        const orderExists = await prisma.order.findUnique({ where: { id: orderId } });
        if (!orderExists) {
            return NextResponse.json({ message: "Pedido não encontrado." }, { status: 404 });
        }

        const itemExists = await prisma.item.findUnique({ where: { id: itemId } });
        if (!itemExists) {
            return NextResponse.json({ message: "Item não encontrado." }, { status: 404 });
        }

        const existingOrderItem = await prisma.orderItem.findFirst({
            where: { orderId, itemId },
        });

        let orderItem;
        if (existingOrderItem) {
            orderItem = await prisma.orderItem.update({
                where: { id: existingOrderItem.id },
                data: { quantity: existingOrderItem.quantity + quantity },
            });
    
        } else {
            orderItem = await prisma.orderItem.create({
                data: { orderId, itemId, quantity, observation },
            });
        }

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

const PUT = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const body = await req.json();
        const { quantity } = body;

        if (!id || !quantity || quantity <= 0) {
            return NextResponse.json({ message: "O ID do item e a quantidade válida são obrigatórios." }, { status: 400 });
        }

        const orderItem = await prisma.orderItem.findUnique({ where: { id } });
        if (!orderItem) {
            return NextResponse.json({ message: "Item do pedido não encontrado." }, { status: 404 });
        }

        const order = await prisma.order.findUnique({ where: { id: orderItem.orderId } });
        if (order && order.status === "preparing") {
            return NextResponse.json({ message: "Não é possível alterar o item pois o pedido está em preparação." }, { status: 403 });
        }

        const updatedOrderItem = await prisma.orderItem.update({
            where: { id },
            data: { quantity },
        });

        return NextResponse.json({ message: "Item atualizado com sucesso!", updatedOrderItem }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erro ao alterar o item do pedido." }, { status: 500 });
    }
};



export { GET, POST, DELETE, PUT };
