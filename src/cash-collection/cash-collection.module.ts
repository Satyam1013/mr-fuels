import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CashCollection, CashCollectionSchema } from "./cash-collection.schema";
import { CashCollectionService } from "./cash-collection.service";
import { CashCollectionController } from "./cash-collection.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CashCollection.name, schema: CashCollectionSchema },
    ]),
  ],
  controllers: [CashCollectionController],
  providers: [CashCollectionService],
})
export class CashCollectionModule {}
