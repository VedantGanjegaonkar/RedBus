import { Request, Response } from 'express';
import busService from '../sevices/bus.service';
import { errorHandler } from '../middleware/errorHandler';


class BusController {
  // Create a new bus
  async createBus(req: Request, res: Response): Promise<void> {
    try {
      const bus = await busService.createBus(req.body);
      res.status(201).json(bus);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }
  async getAllBuses(req: Request, res: Response): Promise<void> {
    try {
      const buses = await busService.getAllBuses();
      res.status(200).json(buses);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get bus by ID
  async getBusById(req: Request, res: Response): Promise<void> {
    try {
      const bus = await busService.getBusById(req.params.id);
      if (bus) {
        res.status(200).json(bus);
      } else {
        res.status(404).json({ message: 'Bus not found' });
      }
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }





  // Update bus
  async updateBus(req: Request, res: Response): Promise<void> {
    try {
      const bus = await busService.updateBus(req.params.id, req.body);
      if (bus) {
        res.status(200).json(bus);
      } else {
        res.status(404).json({ message: 'Bus not found' });
      }
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete bus
  async deleteBus(req: Request, res: Response): Promise<void> {
    try {
      const bus = await busService.deleteBus(req.params.id);
      if (bus) {
        res.status(200).json({ message: 'Bus deleted successfully' });
      } else {
        res.status(404).json({ message: 'Bus not found' });
      }
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }


  
}

export default new BusController();
