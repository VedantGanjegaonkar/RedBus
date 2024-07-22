import { Router } from 'express';
import bookingController from '../controller/booking.controller';

const router = Router();

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookingsByUserId);

export default router;
