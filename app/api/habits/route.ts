
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';

import { getSession } from '../auth/[...nextauth]/options';

import { createHabit, getHabits } from './controller';

export async function GET() {
  try {
    await dbConnect()
    const session = await getSession();
    const userId = session?.user?.id;

  
    if (!userId) {
      return NextResponse.json({
        message: "User not authenticated."
      }, { status: 401 });
    }
  
    const habits = await getHabits(userId);
  
    return NextResponse.json(habits, { status: 200 });
  } catch (error) {
    console.error("Error fetching habits:", JSON.stringify(error, null, 2));
    return NextResponse.json({ message: "Error fetching habits." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
  
    const userId = session?.user?.id
    
    if (!userId) {
      return NextResponse.json({
        message: "User not authenticated."
      }, { status: 401 });
    }

    const body = await request.json();

    const { name, startDate } = body;
    if (!name || !startDate) {
      return NextResponse.json({ message: "Name and Start Date are required." }, { status: 400 });
    }

    const newHabit = await createHabit({ ...body, userId });

    return NextResponse.json(newHabit, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", JSON.stringify(error, null, 2));
    return NextResponse.json({ message: "Error creating habit." }, { status: 500 });
  }
}

