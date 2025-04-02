import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authenticate from "@/middlewares/authMiddleware";

const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const action = body.action;

        if (!process.env.JWT_SECRET) {
            return NextResponse.json({ message: "Chave JWT_SECRET não informada no .env" }, { status: 500 });
        }

        if (action === 'register') {
            if (!body.name || !body.email || !body.password) {
                return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
            }

            if (!validateEmail(body.email)) {
                return NextResponse.json({ message: 'Email inválido.' }, { status: 400 });
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

            const token = jwt.sign({ id: provider.id, email: provider.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password, ...providerData } = provider;
            return NextResponse.json({ message: 'Provider criado com sucesso', provider: providerData, token }, { status: 201 });
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

            const token = jwt.sign({ id: provider.id, email: provider.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const { password, ...providerData } = provider;
            return NextResponse.json({ message: 'Login executado com sucesso', provider: providerData, token }, { status: 200 });
        }

        return NextResponse.json({ message: 'Ação não reconhecida.' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: "Erro interno do servidor", error }, { status: 500 });
    }
}

const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: 'ID é necessário para buscar o provider.' }, { status: 400 });
        }

        const provider = await prisma.provider.findUnique({
            where: { id },
            include: { item: true, table: true, order: true }
        });

        if (!provider) {
            return NextResponse.json({ message: 'Provider não encontrado.' }, { status: 404 });
        }

        return NextResponse.json(provider, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Erro interno do servidor", error }, { status: 500 });
    }
}

const DELETE = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);

        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }    

        const id = auth.id;

        const provider = await prisma.provider.findUnique({ where: { id } });

        if (!provider) {
            return NextResponse.json({ message: 'Provider não encontrado.' }, { status: 404 });
        }

        await prisma.provider.delete({ where: { id } });

        return NextResponse.json({ message: 'Provider excluído com sucesso.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Erro interno do servidor", error }, { status: 500 });
    }
}

const PUT = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const auth = await authenticate(req);

        if (!auth || typeof auth !== 'object' || !('id' in auth)) {
            return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
        }

        if (!body.id || auth.id !== body.id) {
            return NextResponse.json({ message: "Usuário não autorizado." }, { status: 403 });
        }    

        const provider = await prisma.provider.update({
            where: { id: body.id },
            data: {
                name: body.name,
                description: body.description,
            }
        });

        return NextResponse.json({ message: 'Provider atualizado com sucesso', provider }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Erro interno do servidor", error }, { status: 500 });
    }
}

export { POST, GET, DELETE, PUT };