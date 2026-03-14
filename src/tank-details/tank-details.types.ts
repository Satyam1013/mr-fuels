import { Types } from "mongoose";

export interface Tank {
  _id: Types.ObjectId;
  capacityKl: string;
  dsrTankStock: string;
  fuelType: string;
  price: number;
  tankNo: number;
}
