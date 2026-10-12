import { model, Schema } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: 'A team working toward its fitness goals.' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0, min: 0 },
    seedTag: { type: String, select: false },
  },
  { timestamps: true },
);

export default model('Team', teamSchema);
