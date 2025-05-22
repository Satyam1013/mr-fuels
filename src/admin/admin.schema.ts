import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/user/user.schema";

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true, unique: true })
  businessEmail: string;

  @Prop({ required: true })
  mobileNo: string; // Should be string to allow numbers like "1234567890"

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [
      {
        type: { type: String, required: true },
        number: { type: Number, required: true },
      },
    ],
  })
  tankCapacity: { type: string; number: number }[];

  @Prop({
    type: [
      {
        machineNo: { type: String, required: true },
        nozzleCount: { type: Number, required: true },
        nozzles: [
          {
            nozzleType: { type: String, required: true },
          },
        ],
      },
    ],
  })
  machines: {
    machineNo: string;
    nozzleCount: number;
    nozzles: { nozzleType: string }[];
  }[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  managers: User[];

  _id: any;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
