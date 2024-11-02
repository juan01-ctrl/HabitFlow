import { NextResponse } from 'next/server';

import { getSession } from '@/app/api/auth/[...nextauth]/options';
import dbConnect      from '@/lib/dbConnect';

import { deleteHabit, updateHabit } from '../controller';

interface Params {
    id: string
}

export async function PATCH(req: Request, { params }: { params: Promise<Params> }) {
  try {
    await dbConnect();
    const session = await getSession();
    const userId = session?.user?.id;
  
    const id = (await params).id
    const body = await req.json();
  
    if (!userId) {
      return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }
  
    if (!id) {
      return NextResponse.json({ message: "Habit ID is required." }, { status: 400 });
    }
  
    const updatedHabit = await updateHabit(id, body);
  
    return NextResponse.json(updatedHabit, { status: 200 });
  } catch (error) {
    console.error("Error updating habit:", JSON.stringify(error, null, 2));
    return NextResponse.json({ message: "Error updating habit." }, { status: 500 });
  }
}
  
export async function DELETE(_req: Request, { params }: { params: Promise<Params> }) {
  try {
    await dbConnect();

    const session = await getSession();
    const userId = session?.user?.id;
  
    const id = (await params).id ;
  
    if (!userId) {
      return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }
  
    if (!id) {
      return NextResponse.json({ message: "Habit ID is required." }, { status: 400 });
    }
  
    console.log('here')
    await deleteHabit(id);
    console.log('here 2')
    return NextResponse.json({ message: "Habit deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json({ message: "Error deleting habit." }, { status: 500 });
  }
}