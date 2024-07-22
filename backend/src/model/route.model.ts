import mongoose, { Schema } from 'mongoose';
import { IRoute } from '../interfaces';

const stopSchema = new Schema({
  stop_name: { type: String, required: true },
  stop_time: { type: Date, required: true },
  distance_from_start: { type: Number, required: true }
});

const routeSchema: Schema<IRoute> = new Schema({
  route_name: { type: String, required: true },
  start_point: { type: String, required: true },
  end_point: { type: String, required: true },
  stops: [stopSchema],
  total_distance: { type: Number, required: true }
});

const Route = mongoose.model<IRoute>('Route', routeSchema);

export default Route;
