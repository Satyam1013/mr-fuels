import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  CreditorContact,
  CreditorContactDocument,
} from "./creditor-contact.schema";
import {
  CreateCreditorContactDto,
  UpdateCreditorContactDto,
} from "./creditor-contact.dto";

@Injectable()
export class CreditorContactService {
  constructor(
    @InjectModel(CreditorContact.name)
    private readonly contactModel: Model<CreditorContactDocument>,
  ) {}

  async create(dto: CreateCreditorContactDto) {
    return this.contactModel.create(dto);
  }

  async findAll() {
    const contacts = await this.contactModel
      .find()
      .select("name number")
      .lean();
    return { contacts };
  }

  async getById(id: string) {
    const contact = await this.contactModel.findById(id);
    if (!contact) throw new NotFoundException("Creditor contact not found");
    return contact;
  }

  async update(id: string, dto: UpdateCreditorContactDto) {
    const updated = await this.contactModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException("Contact not found");
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.contactModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException("Contact not found");
    return { message: "Contact deleted successfully" };
  }
}
