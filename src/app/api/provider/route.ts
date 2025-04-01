import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const POST = async (req: NextRequest) => {
    const body = await req.json();
    const action = body.action;

    if (action === 'register') {
        if (!body.name || !body.email || !body.password) {
            return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
        }

        const existingProvider = await prisma.provider.findUnique({
            where: { email: body.email },
        });
        if (existingProvider) {
            return NextResponse.json({ message: 'Email já registrado.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const provider = await prisma.provider.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
            }
        });

        if (!process.env.JWT_SECRET) {
            return NextResponse.json({ message: "Chave JWT_SECRET não informada no .env" }, { status: 500 });
        }

        const token = jwt.sign({ id: provider.id, email: provider.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return NextResponse.json({ message: 'Provider criado com sucesso', provider, token }, { status: 201 });
    }

    else if (action === 'login') {
        if (!body.email || !body.password) {
            return NextResponse.json({ message: 'Email e senha são obrigatórios.' }, { status: 400 });
        }

        const provider = await prisma.provider.findUnique({ where: { email: body.email } });

        if (!provider) {
            return NextResponse.json({ message: 'Provider não encontrado.' }, { status: 404 });
        }

        const match = await bcrypt.compare(body.password, provider.password);

        if (!match) {
            return NextResponse.json({ message: 'Senha inválida.' }, { status: 400 });
        }

        if (!process.env.JWT_SECRET) {
            return NextResponse.json({ message: "Chave JWT_SECRET não informada no .env" }, { status: 500 });
        }

        const token = jwt.sign({ id: provider.id, email: provider.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return NextResponse.json({ message: 'Login executado com sucesso', provider, token }, { status: 200 });
    }

    return NextResponse.json({ message: 'Ação não reconhecida.' }, { status: 400 });
}

const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ message: 'ID é necessário para buscar o provider.' }, { status: 400 });
    }

    const provider = await prisma.provider.findUnique({ where: { id } });

    if (!provider) {
        return NextResponse.json({ message: 'Provider não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(provider, { status: 200 });
}

const DELETE = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ message: 'ID é necessário para excluir o provider.' }, { status: 400 });
    }

    const provider = await prisma.provider.findUnique({ where: { id } });

    if (!provider) {
        return NextResponse.json({ message: 'Provider não encontrado.' }, { status: 404 });
    }

    await prisma.provider.delete({ where: { id } });

    return NextResponse.json({ message: 'Provider excluído com sucesso.' }, { status: 200 });
}

const PUT = async (req: NextRequest) => {
    const body = await req.json();

    if (!body.id || !body.name || !body.description) {
        return NextResponse.json({ message: 'ID, name e description são obrigatórios para a atualização.' }, { status: 400 });
    }

    const existingProvider = await prisma.provider.findUnique({ where: { id: body.id } });

    if (!existingProvider) {
        return NextResponse.json({ message: 'Provider não encontrado.' }, { status: 404 });
    }

    const provider = await prisma.provider.update({
        where: { id: body.id },
        data: {
            name: body.name,
            description: body.description,
        }
    });
    return NextResponse.json({ message: 'Provider atualizado com sucesso', provider }, { status: 200 });
}

export { POST, GET, DELETE, PUT };
