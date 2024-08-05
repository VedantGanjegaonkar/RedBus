import { IBookingRequest } from './interface';
import mongoose from 'mongoose';
import { Route, Bus, Booking } from '../model';
import { NotFoundError, ValidationError } from '../utils/errors';


class BookingService {
  async bookSeatsFromTo(bookingRequest: IBookingRequest): Promise<any> {
    console.log('Starting bookSeatsFromTo');
  const { busId, userId, routeId, startStop, endStop, travelDate, passengerDetails } = bookingRequest;
    
  const route = await Route.findById(routeId);
  const bus = await Bus.findById(busId);

  if (!route || !bus) {
    throw new Error('Route or Bus not found');
  }

  // Validate stops
  const startStopIndex = route.stops.findIndex(stop => stop.stop_name === startStop);
  const endStopIndex = route.stops.findIndex(stop => stop.stop_name === endStop);

  if (startStopIndex === -1 || endStopIndex === -1 || startStopIndex >= endStopIndex) {
    throw new Error('Invalid start or end stop');
  }

  // Prepare update operations
  const updateOperations: any = {
    $inc: { available_seats: -passengerDetails.length },
    $set: {}
  };

  // Check seat availability and prepare update for seating arrangement
  for (let detail of passengerDetails) {
    const [layer, row, col] = detail.seat.split('').map(Number);
    
    if (bus.seating_arrangement[layer][row][col] !== 'available') {
      throw new Error(`Seat ${detail.seat} is not available`);
    }

    updateOperations.$set[`seating_arrangement.${layer}.${row}.${col}`] = 'booked';
  }
  //function to update ultra_seating_arrangement by adding key and newArray=>[startStopIndex,endStopIndex] in object

  for (let detail of passengerDetails) {
    
    const [layer, row, col] = detail.seat.split('').map(Number);
    const seatingObject = bus.ultra_seating_arrangement[layer]?.[row]?.[col] || new Map();
    const currentMaxKey = seatingObject.size > 0 ? Math.max(...Array.from(seatingObject.keys())) : -1;
    const newKey = currentMaxKey + 1;

    console.log("currentMaxKey:",currentMaxKey);
    
    seatingObject.set(newKey, [startStopIndex, endStopIndex]);
    console.log("seatingObject:",seatingObject);
    
    
    // if (bus.seating_arrangement[layer][row][col] !== 'available') {
    //   throw new Error(`Seat ${detail.seat} is not available`);
    // }

    updateOperations.$set[`ultra_seating_arrangement.${layer}.${row}.${col}`] =seatingObject;
  }

  console.log('Update operations:', JSON.stringify(updateOperations, null, 3));

  // Apply updates to the bus document
  const updatedBus = await Bus.findByIdAndUpdate(
    busId,
    updateOperations,
    { new: true, runValidators: true }
  );

  if (!updatedBus) {
    throw new Error('Failed to update bus');
  }

  console.log('Updated bus:', updatedBus);

  let d1 = route.stops[startStopIndex].distance_from_start;
  let d2 = route.stops[endStopIndex].distance_from_start;
  let total_KM = d2 - d1;
  let fare = total_KM * 5;

  // Create booking
  const booking = new Booking({
    user_id: userId,
    bus_id: busId,
    route_id: routeId,
    booking_date: new Date(),
    travel_date: travelDate,
    seats_booked: passengerDetails.length,
    total_price: passengerDetails.length * fare,
    status: 'confirmed',
    seats: passengerDetails.map(detail => detail.seat),
    passenger_details: passengerDetails,
    start_city: route.stops[startStopIndex],
    end_city: route.stops[endStopIndex]
  });
  await booking.save();

  console.log("total fare:", booking.total_price);
  
  return booking;
}

async updateAvailableSeats(
  busId: mongoose.Types.ObjectId,
  startStop: string,
  endStop: string,
  routeId: mongoose.Types.ObjectId
): Promise<void> {
  const bus = await Bus.findById(busId);
  const route = await Route.findById(routeId);

  if (!bus || !route) {
    throw new Error('Bus or Route not found');
  }

  const startStopIndex = route.stops.findIndex(stop => stop.stop_name === startStop);
  const endStopIndex = route.stops.findIndex(stop => stop.stop_name === endStop);

  if (startStopIndex === -1 || endStopIndex === -1 || startStopIndex >= endStopIndex) {
    throw new Error('Invalid start or end stop');
  }

  // Recalculate available seats
  const availableSeats = this.recalculateAvailableSeats(bus);

  await Bus.findByIdAndUpdate(busId, { available_seats: availableSeats });
}

async handleBooking(bookingRequest: IBookingRequest): Promise<any> {
  const booking = await this.bookSeatsFromTo(bookingRequest);
  await this.updateAvailableSeats(
    bookingRequest.busId,
    bookingRequest.startStop,
    bookingRequest.endStop,
    bookingRequest.routeId
  );
  return booking;
}

private recalculateAvailableSeats(bus: any): number {
  let availableSeats = 0;
  for (let layer of bus.seating_arrangement) {
    for (let row of layer) {
      for (let seat of row) {
        if (seat === 'available') {
          availableSeats++;
        }
      }
    }
  }
  return availableSeats;
}
  
}



export default new BookingService();
