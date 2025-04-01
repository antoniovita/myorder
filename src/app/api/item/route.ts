import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import authenticate from "@/middlewares/authMiddleware";

const prisma = new PrismaClient();

const POST = async (req: NextRequest) => {
    const body = await req.json();
    const auth = await authenticate(req);

    if (!auth || typeof auth !== 'object' || !('id' in auth)) {
        return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
    }

    if (!body.name || !body.price) {
        return NextResponse.json({ message: "Nome e preço são obrigatórios." }, { status: 400 });
    }

    const item = await prisma.item.create({
        data: {
            name: body.name,
            price: body.price,
            providerId: auth.id,
        },
    });

    return NextResponse.json({ message: "Item criado com sucesso", item }, { status: 201 });
};

const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
        const item = await prisma.item.findUnique({
            where: { id },
        });

        if (!item) {
            return NextResponse.json({ message: "Item não encontrado." }, { status: 404 });
        }

        return NextResponse.json(item, { status: 200 });
    } else {
        const items = await prisma.item.findMany();
        return NextResponse.json(items, { status: 200 });
    }
};

const PUT = async (req: NextRequest) => {
    const body = await req.json();
    const auth = await authenticate(req);

    if (!auth) {
        return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
    }

    if (!body.id || !body.name || !body.price || !body.description) {
        return NextResponse.json({ message: "ID, nome e preço são obrigatórios." }, { status: 400 });
    }

    const item = await prisma.item.findUnique({
        where: { id: body.id },
    });

    if (!item) {
        return NextResponse.json({ message: "Item não encontrado." }, { status: 404 });
    }

    const updatedItem = await prisma.item.update({
        where: { id: body.id },
        data: {
            name: body.name,
            price: body.price,
            description: body.description,
        },
    });

    return NextResponse.json({ message: "Item atualizado com sucesso", updatedItem }, { status: 200 });
};

const DELETE = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ message: "ID é necessário para excluir o item." }, { status: 400 });
    }

    const item = await prisma.item.findUnique({
        where: { id },
    });

    if (!item) {
        return NextResponse.json({ message: "Item não encontrado." }, { status: 404 });
    }

    await prisma.item.delete({
        where: { id },
    });

    return NextResponse.json({ message: "Item excluído com sucesso." }, { status: 200 });
};

export { POST, GET, PUT, DELETE };
