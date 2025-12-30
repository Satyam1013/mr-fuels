import { IsString, IsObject, IsEmail } from "class-validator";

export class CreatePumpDetailsDto {
  @IsString()
  businessName!: string;

  @IsString()
  dealerCode!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  password!: string;

  @IsString()
  confirmPassword!: string;

  // 🔹 Pump Details
  @IsObject()
  pumpDetails!: {
    fuelPartner: string;

    pumpProducts: Array<{
      kl: string;
      dsrTankStock: string;
      price: string;
    }>;

    selectedOptions: string[];

    pumpTime: {
      start: string;
      end: string;
    };

    pumpHours: number;
    dailyCloseReportTime: string;
  };

  // 🔹 Product Details
  @IsObject()
  productDetails!: {
    selectedProducts: string[];
  };

  // 🔹 Machines
  @IsObject()
  machines!: {
    machines: any[];
  };

  // 🔹 Managers
  @IsObject()
  managers!: {
    managers: Array<{
      managerName: string;
      phone: string;
      managerAadhar: any;
      shift: number;
      salary: string;
      password: string;
    }>;
    is24Hour: boolean;
  };

  // 🔹 Staff
  @IsObject()
  staffDetails!: {
    staff: Array<{
      staffName: string;
      staffNumber: string;
      staffAadhar: any;
      shift: number;
      salary: string;
    }>;
  };

  // 🔹 Transactions
  @IsObject()
  transactionDetails!: {
    upiApps: Array<{
      name: string;
      merchantId: string;
    }>;
    swipeSettlement: string;
    swipeStatement: string;
    bankDeposit: string;
  };

  // 🔹 DSR
  @IsObject()
  dsrDetails!: {
    tankConfig: Array<{
      tankNo: string;
    }>;
  };
}
