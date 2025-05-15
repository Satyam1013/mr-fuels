import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/user/user.schema";

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true, unique: true })
  businessEmail: string;

  @Prop({ required: true })
  mobileNo: number;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Object }] })
  tankCapacity: Record<string, string>[];

  @Prop({
    type: [
      {
        machineNo: Number,
        nozel: String,
      },
    ],
  })
  machines: { machineNo: number; nozel: string }[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  managers: User[];

  _id: any;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
