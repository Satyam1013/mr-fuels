import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Customer } from "./customer.schema";
import { CreateCustomerDto, UpdateCustomerDto } from "./customer.dto";

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<Customer>,
  ) {}

  async create(adminId: string, dto: CreateCustomerDto) {
    return this.customerModel.create({
      ...dto,
      adminId: new Types.ObjectId(adminId),
    });
  }

  async findAll(adminId: string) {
    return this.customerModel.find({
      adminId: new Types.ObjectId(adminId),
    });
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findById(id);
    if (!customer) throw new NotFoundException("Customer not found");
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.customerModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!customer) throw new NotFoundException("Customer not found");
    return customer;
  }

  async remove(id: string) {
    const customer = await this.customerModel.findByIdAndDelete(id);
    if (!customer) throw new NotFoundException("Customer not found");

    return { message: "Customer deleted successfully" };
  }
}
