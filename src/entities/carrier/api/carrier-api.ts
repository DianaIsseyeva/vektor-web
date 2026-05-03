import { carriers } from "@/shared/api/mock-db";
import { mockRequest } from "@/shared/api/mock-client";

export const carrierApi = {
  list: async () => mockRequest(() => [...carriers]),
};
