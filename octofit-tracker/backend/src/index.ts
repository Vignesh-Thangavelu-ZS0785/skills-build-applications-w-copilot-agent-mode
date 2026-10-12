import express from 'express';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { connectDatabase } from './config/database.js';
import Activity from './models/activity.js';
import Leaderboard from './models/leaderboard.js';
import Team from './models/team.js';
import User from './models/user.js';
import Workout from './models/workout.js';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

function collectionHandler(find: () => Promise<unknown>): RequestHandler {
  return async (_request: Request, response: Response, next: NextFunction) => {
    try {
      response.json(await find());
    } catch (error) {
      next(error);
    }
  };
}

app.get('/api/users/', collectionHandler(() => User.find().lean()));
app.get('/api/teams/', collectionHandler(() => Team.find().populate('members').lean()));
app.get('/api/activities/', collectionHandler(() => Activity.find().populate('user').lean()));
app.get('/api/leaderboard/', collectionHandler(() => Leaderboard.find().populate('user team').sort({ rank: 1 }).lean()));
app.get('/api/workouts/', collectionHandler(() => Workout.find().lean()));

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Unable to process API request' });
});

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`OctoFit Tracker API listening at ${apiBaseUrl}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Unable to start API:', error);
    process.exitCode = 1;
  });
