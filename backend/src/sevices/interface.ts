import { Types } from 'mongoose';

export interface IBookingRequest {
  busId: Types.ObjectId;
  userId: Types.ObjectId;
  routeId: Types.ObjectId;
  startStop: string;
  endStop: string;
  seats: string[];
  travelDate: Date;
  passengerDetails: { seat: string; gender: 'male' | 'female' }[];
}
