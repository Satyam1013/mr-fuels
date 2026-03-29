import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: true })
export class Tank {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "FuelProductDetail", required: true })
  fuelProductId!: Types.ObjectId;

  @Prop()
  capacityKl!: string;

  @Prop()
  dsrTankStock!: string;

  @Prop()
  tankNo!: number;
}

@Schema({ timestamps: true })
export class TankDetails extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: "Admin",
    required: true,
    unique: true,
    index: true,
  })
  adminId!: Types.ObjectId;

  @Prop({ type: [Tank], default: [] })
  tanks!: Tank[];
}

export const TankDetailsSchema = SchemaFactory.createForClass(TankDetails);
