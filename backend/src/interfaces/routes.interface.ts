import { Document } from 'mongoose';

export interface IRoute extends Document {
  route_name: string;
  start_point: string;
  end_point: string;
  stops: {
    stop_name: string;
    stop_time: Date;
    distance_from_start: number;
  }[];
  total_distance: number;
}
