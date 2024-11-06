
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
      .sort('week')
      .populate('habitId', 'name daysPerWeek')
      .lean();

    if (!statistics || statistics.length === 0) {
      return NextResponse.json({ message: 'No statistics found for this user.' }, { status: 404 });
    }

    const groupedByWeek = statistics.reduce((acc, stat) => {
      const week = stat.week.toISOString();

      if (!acc[week]) {
        acc[week] = { week, habits: [] };
      }

      const habitName = stat.habitId.name;
      const completion = stat.completion;

      acc[week].habits.push({
        name: habitName,
        completion: completion,
      });

      return acc;
    }, {});

    const result = Object.values(groupedByWeek).map((weekData) => {
      return weekData;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ message: 'Failed to fetch statistics' }, { status: 500 });
  }
}