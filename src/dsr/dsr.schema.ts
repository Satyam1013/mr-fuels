import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class TankConfig {
  @Prop() tankNo!: string;
}

@Schema({ timestamps: true })
export class DsrDetails extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: [TankConfig], default: [] })
  tankConfig!: TankConfig[];
}

export const DsrDetailsSchema = SchemaFactory.createForClass(DsrDetails);
