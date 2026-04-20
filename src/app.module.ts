import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";

import { AuthModule } from "./auth/auth.module";
import { PumpDetailsModule } from "./pump-details/pump-details.module";
import { ManagerModule } from "./managers/managers.module";
import { StaffModule } from "./staff/staff.module";
import { TransactionDetailsModule } from "./transactions/transactions.module";
import { ProductDetailsModule } from "./product-details/product-details.module";
import { MachineModule } from "./machines/machines.module";
import { DsrDetailsModule } from "./dsr/dsr.module";
import { PlanModule } from "./plan-details/plan-details.module";
import { NonFuelProductsModule } from "./non-fuel-product/non-fuel-product.module";
import { HomeModule } from "./home/home.module";
import { TankModule } from "./tank-details/tank-details.module";
import { PumpStatusModule } from "./pump-status/pump-status.module";
import { SalesModule } from "./sales/sales.module";
import { ShiftMachineModule } from "./shift-machine/shift-machine.module";
import { CreditorModule } from "./creditors/creditors.module";
import { PumpExpenseModule } from "./pump-expense/pump-expense.module";
import { PersonalExpenseModule } from "./personal-expense/personal-expense.module";
import { PrepaidModule } from "./prepaid/prepaid.module";
import { CashCollectionModule } from "./cash-collection/cash-collection.module";
import { DigitalPaymentModule } from "./digital-payment/digital-payment.module";
import { MachineCalculationModule } from "./machine-calculation/machine-calculation.module";
import { NonFuelProductSaleModule } from "./non-fuel-product-sales/non-fuel-product-sales.module";
import { ShiftStatusModule } from "./shift-status/shift-status.module";
import { CustomerModule } from "./customer/customer.module";
import { FuelProductModule } from "./fuel-product/fuel-product.module";
import { BankDepositModule } from "./bank-deposit/bank-deposit.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    ScheduleModule.forRoot(),
    AuthModule,
    PumpDetailsModule,
    ManagerModule,
    StaffModule,
    TransactionDetailsModule,
    ProductDetailsModule,
    MachineModule,
    DsrDetailsModule,
    PlanModule,
    NonFuelProductsModule,
    HomeModule,
    TankModule,
    PumpStatusModule,
    SalesModule,
    ShiftMachineModule,
    CreditorModule,
    PumpExpenseModule,
    PersonalExpenseModule,
    PrepaidModule,
    CashCollectionModule,
    DigitalPaymentModule,
    MachineCalculationModule,
    NonFuelProductSaleModule,
    ShiftStatusModule,
    CustomerModule,
    FuelProductModule,
    BankDepositModule,
  ],
  providers: [],
})
export class AppModule {}
