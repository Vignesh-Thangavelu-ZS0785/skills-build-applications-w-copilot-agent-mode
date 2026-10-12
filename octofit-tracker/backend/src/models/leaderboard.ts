import { model, Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
    period: { type: String, required: true, trim: true },
    seedTag: { type: String, select: false },
  },
  { timestamps: true },
);

leaderboardSchema.index({ period: 1, rank: 1 });

export default model('Leaderboard', leaderboardSchema);
