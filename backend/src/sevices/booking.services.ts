import { IBookingRequest } from './interface';
import mongoose from 'mongoose';
import { Route, Bus, Booking } from '../model';
import { NotFoundError, ValidationError } from '../utils/errors';


class BookingService {
  // Book seats from one stop to another
  async bookSeatsFromTo(
    bookingRequest: IBookingRequest
  ) {
    const { busId, userId, routeId, startStop, endStop, seats, travelDate, passengerDetails } = bookingRequest;
    const route = await Route.findById(routeId);
    const bus = await Bus.findById(busId);

    if (!route || !bus) {
      throw new Error('Route or Bus not found');
    }

    // Validate stops
    const startStopIndex = route.stops.findIndex(stop => stop.stop_name === startStop);
    const endStopIndex = route.stops.findIndex(stop => stop.stop_name === endStop);

    if (startStopIndex === -1 || endStopIndex === -1 || startStopIndex > endStopIndex) {
      throw new Error('Invalid start or end stop');
    }

    // Check seat availability and gender restrictions
    for (let detail of passengerDetails) {
    //   const [layer, row, col] = detail.seat.split(':');
    //   const layerIndex = parseInt(layer) - 1;
    //   const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0); // Convert row letter to index
    //   const colIndex = parseInt(col) - 1; // Convert column number to index
     
    const [layer, row, col] = detail.seat.split('');
    const layerIndex = parseInt(layer)
    const rowIndex = parseInt(row) 
    const colIndex = parseInt(col) 
        console.log(layer,rowIndex,colIndex);
        console.log(bus.seating_arrangement[layerIndex][rowIndex][colIndex]);
        
        

      if (bus.seating_arrangement[layerIndex][rowIndex][colIndex] !== 'available') {
        throw new Error(`Seat ${detail.seat} is not available`);
      }

      if (bus.seating_gender_restrictions[layerIndex][rowIndex][colIndex] && bus.seating_gender_restrictions[layerIndex][rowIndex][colIndex] !== detail.gender) {
        throw new Error(`Seat ${detail.seat} is not available for ${detail.gender} passengers`);
      }
    }

    // Mark seats as booked
    for (let detail of passengerDetails) {
        const [layer, row, col] = detail.seat.split('');
        const layerIndex = parseInt(layer)
        const rowIndex = parseInt(row) 
        const colIndex = parseInt(col) 

        console.log(layer,rowIndex,colIndex);
        console.log(bus.seating_arrangement[layerIndex][rowIndex][colIndex]);

      bus.seating_arrangement[layerIndex][rowIndex][colIndex] = 'booked';
    }

    bus.available_seats -= passengerDetails.length;
    
    
    await bus.save();

    let d1=route.stops[startStopIndex].distance_from_start
    let d2=route.stops[endStopIndex].distance_from_start
    let total_KM=d2-d1
    let fare=total_KM*5  

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
      end_city:route.stops[endStopIndex]
    });
    await booking.save();
   
    console.log("total fare :",booking.total_price);
    
    return booking;
    
  }



  // Update available seats after booking
  async updateAvailableSeats(
    busId: mongoose.Types.ObjectId,
    startStop: string,
    endStop: string,
    routeId: mongoose.Types.ObjectId
  ) {
    const bus = await Bus.findById(busId);
    const route = await Route.findById(routeId);

    if (!bus || !route) {
      throw new Error('Bus or Route not found');
    }

    // pValidate stos
    const startStopIndex = route.stops.findIndex(stop => stop.stop_name === startStop);
    const endStopIndex = route.stops.findIndex(stop => stop.stop_name === endStop);

    if (startStopIndex === -1 || endStopIndex === -1 || startStopIndex > endStopIndex) {
      throw new Error('Invalid start or end stop');
    }

    //Reset availability for stops after endStop
    for (let i = endStopIndex + 1; i < route.stops.length; i++) {
      const stopName = route.stops[i].stop_name;

      // Free up seats for the remaining stops
      if (bus.seat_booking_status[stopName]) {
        bus.seating_arrangement = bus.seat_booking_status[stopName];
        bus.available_seats = bus.seating_arrangement.flat(2).filter(seat => seat === 'available').length;
      }
      
    }
   
    await bus.save();
  }

  // Handle booking process
  async handleBooking(bookingRequest: IBookingRequest) {
    const [bookSeatsResult] = await Promise.all([
      this.bookSeatsFromTo(bookingRequest),
      this.updateAvailableSeats(
        bookingRequest.busId,
        bookingRequest.startStop,
        bookingRequest.endStop,
        bookingRequest.routeId
      )
    ]);
  
    return bookSeatsResult;
  }
  
}



export default new BookingService();
