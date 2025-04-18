import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; 

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        
        if (!body.tableId || !body.userId || !body.providerId || !body.price) {
            return NextResponse.json({ message: "tableId, userId, providerId e price são obrigatórios." }, { status: 400 });
        }

        const order = await prisma.order.create({
            data: {
                tableId: body.tableId,
                userId: body.userId,
                providerId: body.providerId,
                price: body.price,
                status: "ativo",
                date: new Date(),
            },
            include: {
                table: true,
                user: true,
                provider: true,
                orderItem: true,
            },
        });

        return NextResponse.json({ message: "Pedido criado com sucesso!", order }, { status: 201 });

    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return NextResponse.json({ message: "Erro ao criar pedido." }, { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const providerId = searchParams.get("providerId");
        const tableId = searchParams.get("tableId");
        const userId = searchParams.get("userId");

        if (!providerId && !tableId && !userId) {
            return NextResponse.json({ message: "É necessário fornecer um providerId, tableId ou userId." }, { status: 400 });
        }

        let whereCondition = {};
        if (providerId) whereCondition = { providerId };
        else if (tableId) whereCondition = { tableId, status: 'ativo' };
        else if (userId) whereCondition = { userId };

        const orders = await prisma.order.findMany({
            where: whereCondition,
            include: {
                table: true,
                user: true,
                provider: true,
                orderItem: { include: { item: true}}
            },
        });

        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        return NextResponse.json({ message: "Erro ao buscar pedidos." }, { status: 500 });
    }
};

// atualizar o status do pedido
export const PUT = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID é obrigatório." }, { status: 400 });
        }

        const body = await req.json();
        if (!body.status || typeof body.status !== "string") {
            return NextResponse.json({ message: "Status inválido." }, { status: 400 });
        }

        const existingOrder = await prisma.order.findUnique({ where: { id } });

        if (!existingOrder) {
            return NextResponse.json({ message: "Pedido não encontrado." }, { status: 404 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status: body.status },
        });

        return NextResponse.json({ message: "Pedido atualizado com sucesso!", order }, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar pedido:", error);
        return NextResponse.json({ message: "Erro ao atualizar pedido." }, { status: 500 });
    }
};


export const DELETE = async (req: NextRequest) => {
    const params = new URL(req.url).searchParams;
    const id = params.get("id");
    if (!id) return NextResponse.json({ message: "ID é obrigatório." }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ message: "Pedido não encontrado." }, { status: 404 });

    const orderDelete = await prisma.order.delete({ where: { id } });
    if (!orderDelete) return NextResponse.json({ message: "Erro ao cancelar pedido." }, { status: 500 });
    return NextResponse.json({ message: "Pedido cancelado com sucesso!" }, { status: 200 });
};