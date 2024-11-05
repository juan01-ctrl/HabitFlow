// import cron from 'node-cron';

import { NextResponse } from 'next/server';

import { createStatistics } from './createStatistics';


// cron.schedule('0 0 * * 1', async () => {
//   console.log('Running cron job to generate statistics for all users');
//   try {
//     const result = await createStatistics();
//     console.log(result?.message);
//   } catch (error) {
//     console.error('Error during cron job:', error.message);
//   }
// });



export async function GET() {
  try {
    console.log('Running scheduled statistics creation');
    const result = await createStatistics();
    return NextResponse.json({ message: result?.message });
  } catch (error) {
    console.error('Error during scheduled function:', error?.message);
    return NextResponse.error();
  }
}