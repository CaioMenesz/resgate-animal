import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;

    // Verificar se o animal existe e pertence ao usuário
    const animal = await prisma.animal.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!animal) {
      return NextResponse.json(
        { error: 'Animal não encontrado' },
        { status: 404 }
      );
    }

    if (animal.userId !== session.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    await prisma.animal.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Animal removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover animal:', error);
    return NextResponse.json(
      { error: 'Erro ao remover animal' },
      { status: 500 }
    );
  }
} 