import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TankInputType } from "./dsr.enum";

@Schema({ _id: false })
class TankConfig {
  @Prop({ required: true })
  tankNo!: string;

  // Dropdown selection
  @Prop({ enum: TankInputType, required: true })
  inputType!: TankInputType;

  // ===== Manual Entry Fields =====
  @Prop()
  capacity?: string;

  @Prop()
  diameter?: string;

  @Prop()
  length?: string;

  @Prop()
  tankType?: string;

  // ===== Chart Upload Field =====
  @Prop()
  dsrChart?: string;
}

@Schema({ timestamps: true })
export class DsrDetails extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: "Admin",
    required: true,
    unique: true,
    index: true,
  })
  adminId!: Types.ObjectId;

  @Prop({ type: [TankConfig], default: [] })
  tankConfig!: TankConfig[];
}

export const DsrDetailsSchema = SchemaFactory.createForClass(DsrDetails);
