import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import authenticate from "@/middlewares/authMiddleware";

const prisma = new PrismaClient();

const POST = async (req: NextRequest) => {
    const body = await req.json();
    
}