// app/api/users/route.js
import User from '@/app/models/User';
import dbConnect from '@/lib/dbConnect'; // adjust the import path based on your structure
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, {
        status: 400,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists.' }, {
        status: 409,
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });


    return NextResponse.json({ message: 'User created successfully.' }, {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Error creating user.' }, {
      status: 500,
    });
  }
}
