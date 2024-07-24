import mongoose, { Schema } from 'mongoose';
import { IBooking } from '../interfaces';

const bookingSchema: Schema<IBooking> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bus_id: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
  route_id: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  booking_date: { type: Date, required: true },
  travel_date: { type: Date, required: true },
  seats_booked: { type: Number, required: true },
  total_price: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  seats: [String],
  passenger_details: [
    {
      seat: { type: String, required: true },
      gender: { type: String, enum: ['male', 'female'], required: true }
    }
  ],
  start_city: {
    stop_name: { type: String, required: true },  
    stop_time: { type: Date, required: true },
    distance_from_start: { type: Number, required: true }
  },
  end_city: {
    stop_name: { type: String, required: true },
    stop_time: { type: Date, required: true },
    distance_from_start: { type: Number, required: true }
  }
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
