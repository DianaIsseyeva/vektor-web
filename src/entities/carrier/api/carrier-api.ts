import { carriers } from "@/shared/api/mock-db";
import { mockRequest } from "@/shared/api/mock-client";

type GetCarriersParams = {
  search?: string;
};

export const carrierApi = {
  getCarriers: async (params: GetCarriersParams = {}) =>
    mockRequest(() => {
      const search = params.search?.trim().toLowerCase();

      if (!search) {
        return [...carriers];
      }

      return carriers.filter(
        (carrier) =>
          carrier.name.toLowerCase().includes(search) ||
          carrier.mcNumber.toLowerCase().includes(search),
      );
    }),
};
