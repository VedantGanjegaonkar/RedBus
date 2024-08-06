import mongoose from 'mongoose';
import{ Schema, model } from 'mongoose';
import { IBus } from '../interfaces';
import { UltraSeatingElement } from '../interfaces/bus.interface';
// Schema for UltraSeatingElement
const UltraSeatingElementSchema = new Schema({
  type: Map,
  of: {
    type: [Number]
  }
}, { _id: false });

function initializeUltraSeatingArrangement(layers: number, rows: number, cols: number): UltraSeatingElement[][][] {
  const ultraSeatingArrangement: UltraSeatingElement[][][] = [];

  for (let i = 0; i < layers; i++) {
    const layer: UltraSeatingElement[][] = [];
    for (let j = 0; j < rows; j++) {
      const row: UltraSeatingElement[] = [];
      for (let k = 0; k < cols; k++) {
        row.push(new Map<number, number[]>());
      }
      layer.push(row);
    }
    ultraSeatingArrangement.push(layer);
  }

  return ultraSeatingArrangement;
}

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
  pro_seating_arrangement: {
    type: [[[[[Number]]]]],     // four-dimensional array
    default: []
  },
  seating_gender_restrictions: {
    type: [[[String]]],
    default: []
  },
  ultra_seating_arrangement: {
    type: [[[{ type: UltraSeatingElementSchema }]]],
    default: initializeUltraSeatingArrangement(2, 3, 6)
  },
  // seat_booking_status: {
  //   type: Map,
  //   of: [[[String]]],
  //   default: {}
  // }
});

export default model<IBus>('Bus', busSchema);
