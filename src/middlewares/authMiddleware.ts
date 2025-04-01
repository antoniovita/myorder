import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const key = process.env.JWT_SECRET;

if (!key) {
    throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");
}

export const authenticate = (req: NextRequest) => { 
    try {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Rota desautorizada." }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, key);

        return decoded;
    } catch (error) {
        console.error("Erro na autenticação:", error);
        return NextResponse.json({ error: "Token inválido." }, { status: 403 });
    }
};

export default authenticate;
