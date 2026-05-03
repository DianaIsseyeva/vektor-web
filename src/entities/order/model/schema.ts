import { z } from "zod";

export const orderStopSchema = z.object({
  id: z.string(),
  type: z.enum(["pick_up", "drop_off", "stop"]),
  order: z.number(),
  address: z.object({
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zip: z.string().min(3, "ZIP is required"),
  }),
  locationName: z.string().optional(),
  refNumber: z.string().optional(),
  appointmentType: z.enum(["fixed", "window", "fcfs"]),
  appointmentDate: z.string().min(1, "Date is required").nullable(),
  notes: z.string().optional(),
});

export const orderFormSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  referenceNumber: z.string().min(2, "Reference # is required"),
  carrierId: z.string().min(1, "Carrier is required"),
  equipmentType: z.enum(["dry_van", "reefer", "flatbed", "step_deck"]),
  loadType: z.enum(["ftl", "ltl"]),
  rate: z.coerce.number().min(1, "Rate must be greater than 0"),
  weight: z.coerce.number().min(1, "Weight must be greater than 0"),
  notes: z.string(),
  stops: z
    .array(orderStopSchema)
    .min(2, "At least pickup and drop off are required")
    .max(5, "Maximum 5 stops"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
