import { NextRequest, NextResponse } from "next/server";
import authenticate from "@/middlewares/authMiddleware";
import { prisma } from "../../../lib/prisma"; 


export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const auth = await authenticate(req);

        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }

        if (!body.name || !body.price || !body.description) {
            return NextResponse.json({ message: "Nome, preço e descrição são obrigatórios." }, { status: 400 });
        }

        const item = await prisma.item.create({
            data: {
                name: body.name,
                price: body.price,
                description: body.description,
                providerId: auth.id,
            },
        });

        return NextResponse.json({ message: "Item criado com sucesso", item }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar item:", error);
        return NextResponse.json({ message: "Erro ao criar o item." }, { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const item = await prisma.item.findUnique({
                where: { id },
                include: { provider: true },
            });

            if (!item) {
                return NextResponse.json({ message: "Item não encontrado." }, { status: 404 });
            }

            return NextResponse.json(item, { status: 200 });
        } else {
            const items = await prisma.item.findMany({
                include: { provider: true },
            });
            return NextResponse.json(items, { status: 200 });
        }
    } catch (error) {
        console.error("Erro ao buscar item:", error);
        return NextResponse.json({ message: "Erro ao buscar item." }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const auth = await authenticate(req);

        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }

        if (!body.id) {
            return NextResponse.json({ message: "ID é obrigatório." }, { status: 400 });
        }

        const item = await prisma.item.findUnique({
            where: { id: body.id },
        });

        if (!item) {
            return NextResponse.json({ message: "Item não encontrado." }, { status: 404 });
        }

        if (auth.id !== item.providerId) {
            return NextResponse.json({ message: "Usuário não autorizado a atualizar este item." }, { status: 403 });
        }

        const updateData: any = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.price !== undefined) updateData.price = body.price;
        if (body.description !== undefined) updateData.description = body.description;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "Nenhuma atualização foi fornecida." }, { status: 400 });
        }

        const updatedItem = await prisma.item.update({
            where: { id: body.id },
            data: updateData,
        });
        return NextResponse.json({ message: "Item atualizado com sucesso", updatedItem }, { status: 200 });
    } catch (error) {
        console.error("Erro ao atualizar item:", error);
        return NextResponse.json({ message: "Erro ao atualizar item." }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const auth = await authenticate(req);

        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ message: "ID é necessário para excluir o item." }, { status: 400 });
        }

        const item = await prisma.item.findUnique({
            where: { id },
        });

        if (!item) {
            return NextResponse.json({ message: "Item não encontrado." }, { status: 404 });
        }

        if (auth.id !== item.providerId) {
            return NextResponse.json({ message: "Usuário não autorizado a excluir este item." }, { status: 403 });
        }

        await prisma.item.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Item excluído com sucesso." }, { status: 200 });
    } catch (error) {
        console.error("Erro ao excluir item:", error);
        return NextResponse.json({ message: "Erro ao excluir item." }, { status: 500 });
    }
};
