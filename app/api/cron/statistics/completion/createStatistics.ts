import {  Types } from 'mongoose';

import Record    from '@/app/models/Record';
import Statistic from '@/app/models/Statistic';
import User      from '@/app/models/User';
import dbConnect from '@/lib/dbConnect';
import dayjs     from '@/utils/dayjsConfig';

import { calculateWeeklyCompletion } from '../utils';



export async function createStatistics() {
  try {
    await dbConnect();
    
    const users = await User.find({}, '_id').lean(); 


    for (const user of users) {
      const userId = user._id as string;

      const lastWeekStart = dayjs().utc().subtract(1, 'week').startOf('isoWeek').toDate();
      const lastWeekEnd = dayjs().utc().subtract(1, 'week').endOf('isoWeek').toDate();
  
      let records = await Record.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            date: { $gte: lastWeekStart, $lte: lastWeekEnd }
          },
        },
        {
          $group: {
            _id: {
              habitId: '$habitId',
              week: { $dateTrunc: { date: '$date', unit: 'week', binSize: 1, startOfWeek: 'monday' } }
            },
            records: { $push: '$$ROOT' }
          }
        },

        {
          $lookup: {
            from: 'habits',
            localField: '_id.habitId',
            foreignField: '_id',
            as: 'habitDetails'
          }
        },
        {
          $unwind: {
            path: '$habitDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id.habitId',
            weeks: {
              $push: {
                week: '$_id.week',
                records: '$records'
              }
            },
            habitDetails: { $first: '$habitDetails' }
          }
        },
        {
          $project: {
            _id: 1,
            weeks: 1,
            'habitDetails.name': 1,
            'habitDetails.userId': 1,
            'habitDetails.description': 1,
            'habitDetails.daysPerWeek': 1,
            'habitDetails.startDate': 1
          }
        }
      ]);
  
      records = calculateWeeklyCompletion(records);
  
      const statisticPromises = records.map(async (record) => {
        const existingStatistic = await Statistic.findOne({
          habitId: record.habitId,
          week: record.week
        });

        if (!existingStatistic) {
          return Statistic.create({
            week: record.week,
            completion: record.completion,
            habitId: record.habitId,
            userId: userId
          });
        }
        return null; 
      });

      const filteredPromises = statisticPromises.filter(promise => promise !== null);
      await Promise.all(filteredPromises); 
    }

    return { message: 'Statistics created.' };
  } catch (error) {
    console.error('Error during cron job:', error.message);
  }
}