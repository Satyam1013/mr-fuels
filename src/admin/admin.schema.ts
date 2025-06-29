import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Manager {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) mobile: string;
  @Prop({ required: true, type: Object }) aadhar: object;
  @Prop({ required: true }) shift: number;
  @Prop({ required: true }) password: string;
}

@Schema()
export class Admin {
  @Prop({ required: true }) businessName: string;
  @Prop({ required: true }) businessEmail: string;
  @Prop({ required: true }) mobileNo: string;
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
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);
