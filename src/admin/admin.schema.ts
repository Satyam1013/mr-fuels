import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Manager {
  _id!: Types.ObjectId;

  @Prop({ required: true }) name!: string;

  @Prop({ required: true }) mobile!: string;

  @Prop({ type: Object }) aadhar!: object;

  @Prop({ required: true }) shift!: number;

  @Prop({ required: true }) password!: string;

  @Prop({ type: String, default: null })
  refreshToken?: string | null;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);

@Schema({ _id: false })
export class Transaction {
  @Prop({ required: true }) type!: string; // "salary" | "credit"
  @Prop({ required: true }) date!: string;
  @Prop({ required: true }) amount!: number;
  @Prop({ required: true }) description!: string;
  @Prop({ type: Object }) details?: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

@Schema()
export class Staff {
  _id!: Types.ObjectId;

  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) role!: string;
  @Prop({ required: true }) shift!: number;
  @Prop({ required: true }) salaryType!: string; // daily | monthly
  @Prop({ required: true }) salary!: number;
  @Prop({ required: true }) dateJoined!: Date;
  @Prop({ default: true }) paidLeave!: boolean;
  @Prop({ default: false }) salaryPending!: boolean;
  @Prop({ type: Object }) document?: { name: string; file: any };
  @Prop({ default: 0 }) credit!: number;
  @Prop({ default: 0 }) creditLeft!: number;

  @Prop({ type: [TransactionSchema], default: [] })
  transactions!: Transaction[];
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
export type StaffDocument = Staff & Document;

// @Schema({ _id: false })
// class Fuel {
//   @Prop({ required: true }) value!: string;

//   @Prop({ required: true }) kl!: number;

//   @Prop({ required: true }) diameter!: number;

//   @Prop({ required: true }) radius!: number;

//   @Prop({ required: true }) length!: number;

//   @Prop({ type: Object, required: false }) pdf?: object;
// }

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true })
  businessName!: string;

  @Prop({ required: true })
  dealerCode!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: Object, default: {} })
  pumpDetails!: Record<string, any>;

  @Prop({ default: false })
  setupComplete!: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
