import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Plan } from "src/plan/plan.schema";

@Schema()
export class Manager {
  @Prop({ type: Types.ObjectId, auto: true }) _id: Types.ObjectId;

  @Prop({ required: true }) name: string;

  @Prop({ required: true }) mobile: string;

  @Prop({ type: Object }) aadhar: object;

  @Prop({ required: true }) shift: number;

  @Prop({ required: true }) password: string;

  @Prop({ type: String, default: null })
  refreshToken?: string | null;
}

@Schema()
export class Admin {
  @Prop({ required: true }) businessName: string;
  @Prop({ required: true, unique: true }) businessEmail: string;
  @Prop({ required: true, unique: true }) mobileNo: string;
  @Prop({ required: true }) fuelTypes: string[];
  @Prop({ required: true, type: Object }) fuels: any[];
  @Prop({ required: true, type: Object }) machines: any[];
  @Prop({ required: true }) businessUpiApps: string[];
  @Prop() swipeStatement: string;
  @Prop() bankDeposit: string;
  @Prop() noOfEmployeeShifts: number;
  @Prop() shiftDetails: number;

  @Prop({ type: [Manager], required: true })
  managers: Manager[];

  @Prop({ required: true }) password: string;

  @Prop({ type: String, default: null })
  refreshToken?: string | null;

  @Prop({ type: Types.ObjectId, ref: Plan.name })
  plan: Types.ObjectId | Plan;

  @Prop({ type: Boolean, default: false })
  freeTrial: boolean;

  @Prop({ type: Boolean, default: false })
  freeTrialAttempt: boolean;

  @Prop({ type: Boolean, default: false })
  paidUser: boolean;

  @Prop({ type: Boolean, default: false })
  activeAccount: boolean;

  @Prop({ type: Date, default: Date.now })
  startDate: Date;

  @Prop({ type: Date })
  planExpiresAt: Date;
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);
