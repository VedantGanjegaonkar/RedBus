

export interface IUser {
   
    username: string;
    email: string;
    password: string;
    role: string;
    
}

export interface IBookingRequest {
    busId: string;
    routeId: string;
    startStop: string;
    endStop: string;
    seats: string[];
    travelDate: Date;
    passengerDetails: { seat: string; gender: 'male' | 'female' }[];
  }

  export interface ProductQueryParams {
  
    from?: string;
    to?: string;
    date?:Date;
  
  }

