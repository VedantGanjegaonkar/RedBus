import { Request, Response } from 'express';
import { Booking } from '../model';
import mongoose from 'mongoose';
import BookingService from '../sevices/booking.services'; // Ensure you have a BookingService for handling business logic
import { IBookingRequest } from '../sevices/interface';
import { UserService } from '../sevices/user.service';

class BookingController {

    private userService:UserService
    constructor(){
        this.userService = new UserService() 
        this.createBooking=this.createBooking.bind(this)
        this.getBookingsByUserId=this.getBookingsByUserId.bind(this)
    }
  
  async createBooking(req: Request, res: Response): Promise<void> {
    try {
        const authHeader = req.headers['authorization'];
        const userIdStr= await this.userService.getUserId(authHeader)
        const userId=new mongoose.Types.ObjectId(userIdStr)

      const {
        busId,
        routeId,
        startStop,
        endStop,
        seats,
        travelDate,
        passengerDetails
      }: IBookingRequest = req.body;

      if (!busId || !userId || !routeId || !startStop || !endStop || !seats || !travelDate || !passengerDetails) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      // Call the service to create the booking
      const booking = await BookingService.handleBooking({
        busId,
        userId,
        routeId,
        startStop,
        endStop,
        seats,
        travelDate,
        passengerDetails
      });

      // Send success response
      res.status(201).json({ message: 'Booking Succesfull:',booking });
    } catch (error:any) {

        console.log(error.message);
     
      res.status(500).json({ message: error.message });
    }
  }


  async getBookingsByUserId (req: Request, res: Response) {
    try {
      const authHeader = req.headers['authorization'];
      const userId= await this.userService.getUserId(authHeader)
      const bookings = await Booking.find({ user_id: userId }).populate('bus_id');
      
      if (!bookings) {
        return res.status(404).json({ message: 'No bookings found for this user.' });
      }
  
      res.status(200).json(bookings);
    } catch (error:any) {
      res.status(500).json({ message: `Error fetching bookings: ${error.message}` });
    }
  };


}

export default new BookingController();
