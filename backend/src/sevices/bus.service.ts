import { IBus } from "../interfaces";
import { Bus } from "../model";
import mongoose from 'mongoose';

import { NotFoundError, ValidationError, } from "../utils/errors";

class BusService {
  // Create a new bus with initialized two-layer seating arrangement
  async createBus(busData: IBus): Promise<IBus> {
    try {
      // Define default seating arrangement for two layers (3 rows x 6 columns per layer)
      const rows = 3;
      const cols = 6;
      const layerCount = 2;

      const seatingArrangement: string[][][] = Array.from({ length: layerCount }, () => 
        Array.from({ length: rows }, () => 
          Array.from({ length: cols }, () => 'available')
        )
      );

      const seatingGenderRestrictions: (string | null)[][][] = Array.from({ length: layerCount }, () => 
        Array.from({ length: rows }, () => 
          Array.from({ length: cols }, () => null)
        )
      );
      
      // Set default seating arrangement if not provided
      const bus = new Bus({
        ...busData,
        total_seats: (rows * cols * layerCount),
        seating_arrangement: busData.seating_arrangement || seatingArrangement,
        seating_gender_restrictions: busData.seating_gender_restrictions || seatingGenderRestrictions,
        available_seats: busData.total_seats || (rows * cols * layerCount)
      });
      
      await bus.save();
      return bus;
    } catch (error:any) {
        throw new ValidationError("not validate")
    //   throw new Error(`Error creating bus: ${error.message}`);
    }
  }


  //prt 2 


    // Get all buses
    async getAllBuses(): Promise<IBus[]> {

      const pipeline:any[]=[
        {
          '$lookup': {
            'from': 'routes', 
            'localField': 'route_id', 
            'foreignField': '_id', 
            'as': 'routeDetails'
          }
        }, {
          '$unwind': {
            'path': '$routeDetails', 
            'preserveNullAndEmptyArrays': true
          }
        }
      ]

      const bus =Bus.aggregate(pipeline)
      return bus
      }
    
      // Get bus by ID
      async getBusById(busId: string): Promise<IBus[] | null> {
        const busIdObj=new mongoose.Types.ObjectId(busId)

        const pipeline:any[]=[
          {$match: {
            "_id":busIdObj
          }},
          {
            '$lookup': {
              'from': 'routes', 
              'localField': 'route_id', 
              'foreignField': '_id', 
              'as': 'routeDetails'
            }
          }, {
            '$unwind': {
              'path': '$routeDetails', 
              'preserveNullAndEmptyArrays': true
            }
          }
        ]


        const bus =Bus.aggregate(pipeline)
        if(!bus){
            throw new NotFoundError("no bus found")
          }
          return bus
      }


      
        // Update bus
  async updateBus(busId: string, busData: Partial<IBus>): Promise<IBus | null> {
    try {
      return await Bus.findByIdAndUpdate(busId, busData, { new: true });
    } catch (error:any) {
      throw new Error(`Error updating bus: ${error.message}`);
    }
  }

  // Delete bus
  async deleteBus(busId: string): Promise<IBus | null> {
    try {
      return await Bus.findByIdAndDelete(busId);
    } catch (error:any) {
      throw new Error(`Error deleting bus: ${error.message}`);
    }
  }

  
}

export default new BusService();
