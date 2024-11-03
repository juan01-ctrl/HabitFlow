import { NextResponse } from "next/server";

import Note      from "@/app/models/Note";
import dbConnect from "@/lib/dbConnect";
import dayjs     from "@/utils/dayjsConfig";

import { getSession } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
  await dbConnect(); 
  
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  
  try {
    const session = await getSession();
    const userId = session?.user?.id;
  
    if (!userId) {
      return NextResponse.json({
        message: "User not authenticated."
      }, { status: 401 });
    }
    
    const parsedDate = dayjs.utc(date).startOf('day')

    const note = await Note.findOne({ 
      date: { $gte: parsedDate.toDate(), $lt: parsedDate.add(1, 'day').toDate() },  
      userId
    });

    return NextResponse.json(note, { status: 200 }); 
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching note', error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect(); 

  
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({
        message: "User not authenticated."
      }, { status: 401 });
    }

    const { content, date } = await request.json();

    if (!content || !userId || !date) {
      return new Response(JSON.stringify({ message: 'Content, and date are required' }), { status: 400 });
    }

    const newNote = await Note.create({
      content,
      userId,
      date: new Date(date), 
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating note', error }, { status: 500 }); 
  }
}


export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated." },
        { status: 401 }
      );
    }

    const { _id, content } = await request.json();

    if (!_id || !content) {
      return new Response(
        JSON.stringify({ message: "_id, content, and date are required." }),
        { status: 400 }
      );
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id, userId },
      { content },
      { new: true } 
    );

    if (!updatedNote) {
      return NextResponse.json(
        { message: "Note not found or user not authorized." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating note", error },
      { status: 500 }
    );
  }
}
