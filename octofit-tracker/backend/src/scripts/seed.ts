import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Activity from '../models/activity.js';
import Leaderboard from '../models/leaderboard.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import Workout from '../models/workout.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    await Promise.all([
      User.deleteMany({ seedTag: 'octofit-sample' }),
      Team.deleteMany({ seedTag: 'octofit-sample' }),
      Activity.deleteMany({ seedTag: 'octofit-sample' }),
      Leaderboard.deleteMany({ seedTag: 'octofit-sample' }),
      Workout.deleteMany({ seedTag: 'octofit-sample' }),
    ]);

    const users = await User.insertMany([
      { name: 'Mona Octocat', username: 'mona', email: 'mona@example.com', age: 16, fitnessLevel: 'intermediate', seedTag: 'octofit-sample' },
      { name: 'Sam Octocat', username: 'sam', email: 'sam@example.com', age: 17, fitnessLevel: 'beginner', seedTag: 'octofit-sample' },
      { name: 'Alex Octocat', username: 'alex', email: 'alex@example.com', age: 16, fitnessLevel: 'advanced', seedTag: 'octofit-sample' },
    ]);
    const [octocats] = await Team.insertMany([{ name: 'Octocats' }]);
    const [mona, sam, alex] = users;
    const currentDate = new Date();

    await Team.updateOne(
      { _id: octocats._id },
      {
        $set: {
          description: 'A team focused on building healthy habits together.',
          members: users.map((user) => user._id),
          points: 185,
          seedTag: 'octofit-sample',
        },
      },
    );
    await Activity.insertMany([
      { user: mona._id, name: 'Morning run', activityType: 'Running', durationMinutes: 30, distanceKm: 4.2, points: 42, completedAt: currentDate, seedTag: 'octofit-sample' },
      { user: sam._id, name: 'Neighborhood walk', activityType: 'Walking', durationMinutes: 25, distanceKm: 1.8, points: 18, completedAt: currentDate, seedTag: 'octofit-sample' },
      { user: alex._id, name: 'Strength circuit', activityType: 'Strength training', durationMinutes: 40, points: 40, completedAt: currentDate, seedTag: 'octofit-sample' },
    ]);
    await Leaderboard.insertMany([
      { user: mona._id, team: octocats._id, points: 82, rank: 1, period: 'weekly', seedTag: 'octofit-sample' },
      { user: alex._id, team: octocats._id, points: 65, rank: 2, period: 'weekly', seedTag: 'octofit-sample' },
      { user: sam._id, team: octocats._id, points: 38, rank: 3, period: 'weekly', seedTag: 'octofit-sample' },
    ]);
    await Workout.insertMany([
      {
        name: 'Beginner Cardio Intervals',
        description: 'A gentle interval session to build cardiovascular fitness.',
        category: 'cardio',
        difficulty: 'beginner',
        durationMinutes: 20,
        exercises: ['Brisk walk', 'Easy jog', 'Recovery walk'],
        recommendedFor: ['beginner'],
        seedTag: 'octofit-sample',
      },
      {
        name: 'Full-body Strength Circuit',
        description: 'A balanced bodyweight circuit for strength and endurance.',
        category: 'strength',
        difficulty: 'intermediate',
        durationMinutes: 30,
        exercises: ['Squats', 'Push-ups', 'Lunges', 'Plank'],
        recommendedFor: ['intermediate', 'advanced'],
        seedTag: 'octofit-sample',
      },
    ]);
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
