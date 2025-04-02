import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; 

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        if (!body.name || !body.tableId || !body.providerId || !body.price) {
            return NextResponse.json({ message: "Nome, tableId, providerId e price são obrigatórios." }, { status: 400 });
        }

        const order = await prisma.order.create({
            data: {
                tableId: body.tableId,
                userId: body.userId,
                providerId: body.providerId,
                price: body.price,
                status: "pending",
                date: new Date(),
            },
            include: {
                table: true,
            },
        });

        return NextResponse.json({ message: "Pedido criado com sucesso!", order }, { status: 201 });

    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return NextResponse.json({ message: "Erro ao criar pedido." }, { status: 500 });
    }
};

// rota que busca os orders do provider inteiro, da table ou do userId
export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const providerId = searchParams.get("providerId");
        const tableId = searchParams.get("tableId");
        const userId = searchParams.get("userId");

        if (!providerId && !tableId && !userId) {
            return NextResponse.json({ message: "É necessário fornecer um providerId, tableId ou userId." }, { status: 400 });
        }

        let orders;

        if (providerId) {
            orders = await prisma.order.findMany({
                where: { providerId },
            });
        } else if (tableId) {
            orders = await prisma.order.findMany({
                where: { tableId },
            });
        } else if (userId) {
            orders = await prisma.order.findMany({
                where: { userId },
            });
        }

        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        return NextResponse.json({ message: "Erro ao buscar pedidos." }, { status: 500 });
    }
};
