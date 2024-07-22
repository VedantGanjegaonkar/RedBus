import { Document,Schema } from 'mongoose';

export interface IBus extends Document {
  bus_number: string;
  bus_type: 'AC' | 'Non-AC';
  route_id:  Schema.Types.ObjectId;
  total_seats: number;
  available_seats: number;
  seating_arrangement: string[][][];
  seating_gender_restrictions: (string | null)[][][];
  seat_booking_status: { [stopName: string]: string[][][] };   // Track seat availability by stop
}
