import mongoose from 'mongoose';
import{ Schema, model } from 'mongoose';
import { IBus } from '../interfaces';

const busSchema = new Schema<IBus>({
  bus_number: { type: String, required: true },
  bus_type: { type: String, enum: ['AC', 'Non-AC'], required: true },
  route_id: mongoose.Schema.Types.ObjectId,
  total_seats: { type: Number, required: true },
  available_seats: { type: Number, required: true },

  seating_arrangement: {
    type: [[[String]]],     // Three-dimensional array
    default: []
  },
  seating_gender_restrictions: {
    type: [[[String]]],
    default: []
  },
  seat_booking_status: {
    type: Map,
    of: [[[String]]],
    default: {}
  }
});

export default model<IBus>('Bus', busSchema);
