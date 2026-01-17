import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class PumpProduct {
  @Prop() productName!: string;
  @Prop() kl!: string;
  @Prop() dsrTankStock!: string;
  @Prop() price!: string;
}

@Schema({ _id: false })
class PumpTime {
  @Prop() start!: string;
  @Prop() end!: string;
}

@Schema({ timestamps: true })
export class PumpDetails extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop() fuelPartner!: string;

  @Prop({ type: [PumpProduct], default: [] })
  pumpProducts!: PumpProduct[];

  @Prop({ type: [String], default: [] })
  selectedOptions!: string[];

  @Prop({ type: PumpTime })
  pumpTime!: PumpTime;

  @Prop() pumpHours!: number;

  @Prop() dailyCloseReportTime!: string;
}

export const PumpDetailsSchema = SchemaFactory.createForClass(PumpDetails);
