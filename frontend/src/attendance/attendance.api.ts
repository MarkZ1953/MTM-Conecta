import { ResourceAPI } from "@/api";
import type { Attendance, AttendancePayload, PaginatedResponse } from "./attendance.types";

type AttendanceQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  beneficiary?: number;
  event?: number;
  attended?: boolean;
  [key: string]: string | number | boolean | null | undefined;
};

class AttendanceAPI extends ResourceAPI<Attendance> {
    constructor() {
        super({ resource: "attendances" });
    }

    async getAll({
      params,
    }: {
      params: AttendanceQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<Attendance> }> {
      return super.getAll({ params }) as any;
    }
  
    async create({
      data,
    }: {
      data: AttendancePayload;
    }): Promise<{ status: number; data: Attendance }> {
      return super.create({ data }) as any;
    }
  
    async update({
      id,
      data,
    }: {
      id: number;
      data: Partial<AttendancePayload>;
    }): Promise<{ status: number; data: Attendance }> {
      return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.delete(id) as any;
    }
}

export const attendanceAPI = new AttendanceAPI();
