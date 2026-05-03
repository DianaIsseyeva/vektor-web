import type {
  Carrier,
  EquipmentType,
  LoadType,
  Order,
  OrderStatus,
  Stop,
} from "@/entities/order/model/types";

export const carriers: Carrier[] = [
  {
    id: "carrier-1",
    name: "Northline Freight",
    mcNumber: "MC-918244",
    phone: "+1 312 555 0140",
    rating: 4.8,
  },
  {
    id: "carrier-2",
    name: "Blue Ridge Logistics",
    mcNumber: "MC-104882",
    phone: "+1 404 555 0168",
    rating: 4.6,
  },
  {
    id: "carrier-3",
    name: "Summit Express",
    mcNumber: "MC-552019",
    phone: "+1 702 555 0122",
    rating: 4.9,
  },
  {
    id: "carrier-4",
    name: "Metro Haul",
    mcNumber: "MC-771230",
    phone: "+1 214 555 0190",
    rating: 4.4,
  },
  {
    id: "carrier-5",
    name: "Prairie Line",
    mcNumber: "MC-664102",
    phone: "+1 913 555 0181",
    rating: 4.5,
  },
];

const cities = [
  ["Chicago", "IL", "60601"],
  ["Dallas", "TX", "75201"],
  ["Denver", "CO", "80202"],
  ["Atlanta", "GA", "30303"],
  ["Phoenix", "AZ", "85004"],
  ["Memphis", "TN", "38101"],
  ["Columbus", "OH", "43215"],
  ["Charlotte", "NC", "28202"],
] as const;

const statuses: OrderStatus[] = [
  "pending",
  "in_transit",
  "delivered",
  "cancelled",
];
const equipmentTypes: EquipmentType[] = [
  "dry_van",
  "reefer",
  "flatbed",
  "step_deck",
];
const loadTypes: LoadType[] = ["ftl", "ltl"];
const clients = [
  "Acme Foods",
  "Fresh Valley",
  "BuildRight",
  "Northstar Retail",
  "Cobalt Supply",
];

function stop(
  id: string,
  order: number,
  cityIndex: number,
  type: Stop["type"],
): Stop {
  const [city, state, zip] = cities[cityIndex % cities.length];

  return {
    id,
    type,
    order,
    address: { city, state, zip },
    locationName: `${city} Terminal`,
    appointmentType: order % 2 === 0 ? "window" : "fixed",
    appointmentDate: `2026-05-${String(3 + order + cityIndex).padStart(2, "0")}`,
    notes: "",
  };
}

export function createSeedOrders(): Order[] {
  return Array.from({ length: 34 }).map((_, index) => {
    const carrier = carriers[index % carriers.length];
    const status = statuses[index % statuses.length];
    const createdAt = new Date(Date.UTC(2026, 3, 1 + index)).toISOString();
    const hasMiddleStop = index % 3 === 0;
    const stops = [
      stop(`stop-${index}-1`, 1, index, "pick_up"),
      ...(hasMiddleStop ? [stop(`stop-${index}-2`, 2, index + 1, "stop")] : []),
      stop(`stop-${index}-3`, hasMiddleStop ? 3 : 2, index + 2, "drop_off"),
    ];

    return {
      id: `ord-${index + 1}`,
      referenceNumber: `ORD-2026-${String(index + 1).padStart(4, "0")}`,
      status,
      clientName: clients[index % clients.length],
      carrier,
      equipmentType: equipmentTypes[index % equipmentTypes.length],
      loadType: loadTypes[index % loadTypes.length],
      weight: 12000 + index * 430,
      rate: 850 + index * 75,
      notes: index % 2 === 0 ? "Call before arrival." : "",
      stops,
      statusHistory: [{ from: null, to: "pending", changedAt: createdAt }],
      createdAt,
      updatedAt: createdAt,
    };
  });
}
