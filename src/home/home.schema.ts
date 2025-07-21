// src/home/home.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { FilterType } from "./home.dto";

export type HomeDocument = Home & Document;

@Schema({ timestamps: true })
class Category {
  @Prop({ required: true }) id!: number;
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) amount!: number;
}

const CategorySchema = SchemaFactory.createForClass(Category);

@Schema({ timestamps: true })
export class Home {
  @Prop({ required: true, enum: FilterType })
  filterType!: FilterType;

  @Prop({ required: true }) date!: Date;

  @Prop({ type: [CategorySchema], default: [] })
  categories!: Category[];

  @Prop({ type: Object, required: true }) sale!: {
    ltr: number;
    amount: number;
  };
  @Prop({ type: Object, required: true }) collection!: {
    ltr: number;
    amount: number;
  };
  @Prop({ type: Object, required: true }) collected!: {
    ltr: number;
    amount: number;
  };
  @Prop({ type: Object, required: true }) deposited!: {
    ltr: number;
    amount: number;
  };
  @Prop({ type: Object, required: true }) diff!: {
    ltr: number;
    amount: number;
  };

  @Prop({ required: true }) salesTarget!: number;
  @Prop({ required: true }) saleLastMonth!: number;
  @Prop({ required: true }) expensesLastMonth!: number;
}

export const HomeSchema = SchemaFactory.createForClass(Home);
