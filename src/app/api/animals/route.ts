import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const animals = await prisma.animal.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(animals);
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar animais' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session?.user?.id) {
      console.log('Usuário não autenticado ou sem ID');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Dados recebidos:', data);
    
    const { name, species, breed, age, description, imageUrl } = data;

    if (!name || !species || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const animal = await prisma.animal.create({
      data: {
        name,
        species,
        breed: breed || null,
        age: age ? parseInt(age) : null,
        description,
        imageUrl: imageUrl || null,
        userId: session.user.id
      },
    });

    console.log('Animal criado:', animal);
    return NextResponse.json(animal);
  } catch (error) {
    console.error('Erro detalhado ao criar animal:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao criar animal: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao criar animal' },
      { status: 500 }
    );
  }
} 