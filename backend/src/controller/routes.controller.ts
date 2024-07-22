import { Request, Response } from 'express';
import RouteService from '../sevices/routes.servies';

class RouteController {
  // Create a new route
  async createRoute(req: Request, res: Response): Promise<void> {
    try {
      const route = await RouteService.createRoute(req.body);
      res.status(201).json(route);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get all routes
  async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
      const routes = await RouteService.getAllRoutes();
      res.status(200).json(routes);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get route by ID
  async getRouteById(req: Request, res: Response): Promise<void> {
    try {
      const route = await RouteService.getRouteById(req.params.id);
      if (route) {
        res.status(200).json(route);
      } else {
        res.status(404).json({ message: 'Route not found' });
      }
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update route
  async updateRoute(req: Request, res: Response): Promise<void> {
    try {
      const route = await RouteService.updateRoute(req.params.id, req.body);
      if (route) {
        res.status(200).json(route);
      } else {
        res.status(404).json({ message: 'Route not found' });
      }
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete route
  async deleteRoute(req: Request, res: Response): Promise<void> {
    try {
      const route = await RouteService.deleteRoute(req.params.id);
      if (route) {
        res.status(200).json({ message: 'Route deleted successfully' });
      } else {
        res.status(404).json({ message: 'Route not found' });
      }
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new RouteController();
