import { NextRequest, NextResponse } from 'next/server';

import Record, { IRecord } from '@/app/models/Record';
import dbConnect           from '@/lib/dbConnect';

import { getSession } from '../auth/[...nextauth]/options';


export async function POST(req: NextRequest) {
  await dbConnect();

  try {  
    const session = await getSession()
      
    const userId = session?.user?.id
      
    if (!userId) {
      return NextResponse.json({
        message: "User not authenticated."
      }, { status: 401 });
    }

    const { date, completed = false, habitId } = await req.json();

    if (!date || !habitId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newRecord = await Record.create({
      date,
      completed,
      habitId,
      userId,
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const { _id, date, completed, habitId, userId } = await req.json();

    if (!_id) {
      return NextResponse.json({ message: 'Record ID is required' }, { status: 400 });
    }

    const updatedFields: Partial<IRecord> = {};

    if (date) updatedFields.date = date;
    if (typeof completed === 'boolean') updatedFields.completed = completed;
    if (habitId) updatedFields.habitId = habitId;
    if (userId) updatedFields.userId = userId;

    const updatedRecord = await Record.findByIdAndUpdate(_id, updatedFields, { new: true });

    if (!updatedRecord) {
      return NextResponse.json({ message: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
