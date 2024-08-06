import { Document,Schema } from 'mongoose';

export type UltraSeatingElement = Map<number, number[]>;


export interface IBus extends Document {
  bus_number: string;
  bus_type: 'AC' | 'Non-AC';
  route_id:  Schema.Types.ObjectId;
  total_seats: number;
  available_seats: number;
  seating_arrangement: string[][][];
  pro_seating_arrangement: number[][][][][];
  ultra_seating_arrangement: UltraSeatingElement[][][];
  seating_gender_restrictions: (string | null)[][][];
 
}
