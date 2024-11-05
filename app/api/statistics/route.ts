
import { NextResponse } from 'next/server';

import Statistic from '@/app/models/Statistic';
import dbConnect from '@/lib/dbConnect';
import '@/app/models/Habit';

import { getSession } from '../auth/[...nextauth]/options';

export async function GET() {
  try {
    await dbConnect();

    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({
        message: "User not authenticated."
      }, { status: 401 });
    }

    const statistics = await Statistic.find({ userId })
      .populate('habitId', 'name daysPerWeek')
      .lean();

    if (!statistics || statistics.length === 0) {
      return NextResponse.json({ message: 'No statistics found for this user.' }, { status: 404 });
    }

    // Group statistics by week, with only one habit per week
    const groupedByWeek = statistics.reduce((acc, stat) => {
      const week = stat.week.toISOString(); // Format week as a string

      // Initialize the week entry if it doesn't exist
      if (!acc[week]) {
        acc[week] = { week, habits: {} };
      }

      // Add the habit to the week if it hasn't been added yet
      const habitName = stat.habitId.name;
      if (!acc[week].habits[habitName]) {
        acc[week].habits[habitName] = stat.completion;
      }

      return acc;
    }, {});

    // Convert grouped results to desired format
    const result = Object.entries(groupedByWeek).map(([week, data]) => ({
      week,
      ...data?.habits,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ message: 'Failed to fetch statistics' }, { status: 500 });
  }
}