import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class Tank {
  @Prop({ required: true })
  capacityKl!: string;

  @Prop({ required: true })
  dsrTankStock!: string;

  @Prop({ required: true })
  fuelType!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  tankNo!: number;
}

@Schema({ timestamps: true })
export class TankDetails extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: [Tank], default: [] })
  tanks!: Tank[];
}

export const TankDetailsSchema = SchemaFactory.createForClass(TankDetails);
