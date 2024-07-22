import { IRoute } from '../interfaces';
import { Route } from '../model';

class RouteService {
  // Create a new route
  async createRoute(routeData: IRoute): Promise<IRoute> {
    try {
      const route = new Route(routeData);
      await route.save();
      return route;
    } catch (error:any) {
      throw new Error(`Error creating route: ${error.message}`);
    }
  }

  // Get all routes
  async getAllRoutes(): Promise<IRoute[]> {
    try {
      return await Route.find();
    } catch (error:any) {
      throw new Error(`Error retrieving routes: ${error.message}`);
    }
  }

  // Get route by ID
  async getRouteById(routeId: string): Promise<IRoute | null> {
    try {
      return await Route.findById(routeId);
    } catch (error:any) {
      throw new Error(`Error retrieving route: ${error.message}`);
    }
  }

  // Update route
  async updateRoute(routeId: string, routeData: Partial<IRoute>): Promise<IRoute | null> {
    try {
      return await Route.findByIdAndUpdate(routeId, routeData, { new: true });
    } catch (error:any) {
      throw new Error(`Error updating route: ${error.message}`);
    }
  }

  // Delete route
  async deleteRoute(routeId: string): Promise<IRoute | null> {
    try {
      return await Route.findByIdAndDelete(routeId);
    } catch (error:any) {
      throw new Error(`Error deleting route: ${error.message}`);
    }
  }
}

export default new RouteService();
