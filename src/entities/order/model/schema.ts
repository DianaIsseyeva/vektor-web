import { z } from "zod";

export const orderStopSchema = z.object({
  id: z.string(),
  kind: z.enum(["pickup", "stop", "dropoff"]),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(3, "ZIP is required"),
  locationName: z.string().min(2, "Location name is required"),
  appointmentType: z.enum(["fixed", "window", "fcfs"]),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  notes: z.string(),
});

export const orderFormSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  referenceNumber: z.string().min(2, "Reference # is required"),
  carrierId: z.string().min(1, "Carrier is required"),
  equipmentType: z.string().min(1, "Equipment type is required"),
  loadType: z.string().min(1, "Load type is required"),
  rate: z.coerce.number().min(1, "Rate must be greater than 0"),
  weight: z.coerce.number().min(1, "Weight must be greater than 0"),
  notes: z.string(),
  stops: z
    .array(orderStopSchema)
    .min(2, "At least pickup and drop off are required")
    .max(5, "Maximum 5 stops"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
