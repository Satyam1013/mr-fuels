import { Role } from "../admin/admin.enum";

export interface AuthUser {
  _id: string;
  adminId: string;
  role: Role.ADMIN | Role.MANAGER;
}
