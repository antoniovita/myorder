import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

const POST = async (req: NextRequest) => {
    const body = await req.json();
    const action = body.action;
    if (action === 'register') {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const provider = await prisma.provider.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
            }
        })

        if (!process.env.JWT_SECRET) {
            throw new Error("chave JWT_SECRET não informada no .env");
        }
        const token = jwt.sign({ id: body.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return NextResponse.json({ message: 'Provider criado com sucesso', provider, token });

    }

    else if (action === 'login') {
        const body = await req.json();
        const provider = await prisma.provider.findUnique({where: {email: body.email} })
        if (!provider) {
            return NextResponse.json({message: 'Provider não encontrado.'})
        }
        const match = await bcrypt.compare(body.password, provider.password);
        if (!match) {
            return NextResponse.json({message: 'Senha inválida.'})
        }


        if (!process.env.JWT_SECRET) {
            throw new Error("chave JWT_SECRET não informada no .env");
        }

        const token = jwt.sign({ id: provider.id, email: provider.email }, process.env.JWT_SECRET , { expiresIn: '1h' });
        return NextResponse.json({message: 'Login executado com sucesso', provider, token})
    }
}

//rota protegida para adm falta colocar um middleware para ver se é adm
const GET = async (req: NextRequest) => {
    const body = req.json();
    const provider = await prisma.provider.findAll()
    return NextResponse.json(provider);
}