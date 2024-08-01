import { IBus } from "../interfaces";
import { Bus } from "../model";
import mongoose from 'mongoose';

import { NotFoundError, ValidationError, } from "../utils/errors";

interface ProductQueryParams {
  
  from?: string;
  to?: string;
  date?:Date;

}

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
    async getAllBuses(params: ProductQueryParams): Promise<IBus[]> {

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
        },
        {
          $addFields: {
            "stops":"$routeDetails.stops.stop_name",
            "date": "$routeDetails.stops.stop_time",
          }
        }
      ]




//search filter

const searchFields = [
  "stops"
]

    let searchFilter: any = [];
    if (params.from) {
      // console.log(params.from);

      searchFilter = searchFields.map((field) => ({
        [field]: {
          $regex: params.from,
          $options: 'i',
        },
      }));

     // console.log("this is searhc filter:",searchFilter);
      
    
      const filterQuery = {
        $match: {
          ...(searchFilter.length > 0 && { $or: searchFilter })
  
        }
      }
      pipeline.push(filterQuery)

      }

      if (params.to) {
        // console.log(params.from);
  
        searchFilter = searchFields.map((field) => ({
          [field]: {
            $regex: params.to,
            $options: 'i',
          },
        }));
  
        //console.log("this is searhc filter:",searchFilter);
        
      
        const filterQuery = {
          $match: {
            ...(searchFilter.length > 0 && { $or: searchFilter })
    
          }
        }
        pipeline.push(filterQuery)
  
        }
        //indexing
        if (params.from && params.to) {
          const filterIndexQuery = {
            $match: {
              $expr: {
                $gt: [
                  { $indexOfArray: ["$stops", (params.to)] },
                  { $indexOfArray: ["$stops", (params.from)] }
                ]
              }
            }
          };
          console.log(JSON.stringify(filterIndexQuery));
          
          pipeline.push(filterIndexQuery);
        }
      
      
// date filter 

if(params.date){
  console.log("Date from params:",params.date); 
  
 
  pipeline.push({
    $match: {
      date: {
        "$gte":new Date(params.date),
        "$lt":new Date(params.date)
      }

    }
  });
}



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
