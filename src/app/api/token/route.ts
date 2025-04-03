import { cookies } from 'next/headers';

export async function GET() {
    const token = (await cookies()).get('token')?.value || null;
    const id = (await cookies()).get('id')?.value || null;
    return Response.json({ token , id});
}
