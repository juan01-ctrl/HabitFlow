
interface Stats {
  week: Date;
  completion: number;
  habitId: string;
  userId: string;
}

export function calculateWeeklyCompletion(data): Stats[] {
  const completions: Stats[] = [];

  data.forEach((habit) => {
    const { _id: habitId, weeks, habitDetails } = habit;
    const { daysPerWeek } = habitDetails;
    const userId = habit.habitDetails?.userId;

    weeks.forEach(weekData => {
      const { week, records } = weekData;

      const completedRecords = records.filter(record => record.completed).length;

      const completion = daysPerWeek > 0 ? Math.min(completedRecords / daysPerWeek, 1) : 0;

      completions.push({
        week,
        completion,
        habitId,
        userId
      });
    });
  });

  return completions;
}