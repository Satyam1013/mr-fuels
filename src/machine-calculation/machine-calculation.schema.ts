import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class NozzleCalculation {
  @Prop({ required: true })
  nozzleNumber!: number;

  @Prop({ type: Types.ObjectId, ref: "Staff" })
  staffId!: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Creditor" }], default: [] })
  creditIds!: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "PumpExpense" }], default: [] })
  pumpExpenseIds!: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "PersonalExpense" }],
    default: [],
  })
  personalExpenseIds!: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Prepaid" }], default: [] })
  prepaidIds!: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "NonFuelProduct" }],
    default: [],
  })
  nonFuelProductIds!: Types.ObjectId[];

  // calculated totals

  @Prop()
  fuelSaleAmount!: number;

  @Prop()
  creditTotal!: number;

  @Prop()
  expenseTotal!: number;

  @Prop()
  prepaidTotal!: number;

  @Prop()
  lubricantTotal!: number;

  @Prop()
  finalAmount!: number;
}

@Schema({ timestamps: true })
export class MachineCalculation extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  adminId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Machine", required: true })
  machineId!: Types.ObjectId;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop({ type: [NozzleCalculation], default: [] })
  nozzles!: NozzleCalculation[];
}

export const MachineCalculationSchema =
  SchemaFactory.createForClass(MachineCalculation);
