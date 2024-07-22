import { Document,Schema } from 'mongoose';

export interface IBooking extends Document {
  user_id:  Schema.Types.ObjectId; // Reference to Users collection
  bus_id:  Schema.Types.ObjectId; // Reference to Buses collection
  route_id:  Schema.Types.ObjectId; // Reference to Routes collection
  booking_date: Date;
  travel_date: Date;
  seats_booked: number;
  total_price: number;
  status: 'confirmed' | 'cancelled'; // Add other statuses if needed
  seats: string[]; // Seat numbers or positions
  passenger_details: {
    seat: string;
    gender: 'male' | 'female';
  }[];
  start_city: {
    stop_name: string;
    stop_time: Date;
    distance_from_start: number;
  };
  end_city: {
    stop_name: string;
    stop_time: Date;
    distance_from_start: number;
  };
}

