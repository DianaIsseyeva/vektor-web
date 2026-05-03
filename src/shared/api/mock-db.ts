import type {
  Carrier,
  EquipmentType,
  LoadType,
  Order,
  OrderStatus,
  StatusChange,
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
  {
    id: "carrier-6",
    name: "Ironwood Transport",
    mcNumber: "MC-889431",
    phone: "+1 614 555 0133",
    rating: 4.7,
  },
  {
    id: "carrier-7",
    name: "Red Rock Freight",
    mcNumber: "MC-430118",
    phone: "+1 602 555 0184",
    rating: 4.3,
  },
  {
    id: "carrier-8",
    name: "Lakeside Carriers",
    mcNumber: "MC-237744",
    phone: "+1 216 555 0198",
    rating: 4.6,
  },
  {
    id: "carrier-9",
    name: "Capital Route Logistics",
    mcNumber: "MC-769201",
    phone: "+1 202 555 0117",
    rating: 4.2,
  },
  {
    id: "carrier-10",
    name: "Evergreen Haul",
    mcNumber: "MC-501932",
    phone: "+1 503 555 0149",
    rating: 4.9,
  },
  {
    id: "carrier-11",
    name: "Canyon State Express",
    mcNumber: "MC-640552",
    phone: "+1 480 555 0156",
    rating: 4.4,
  },
  {
    id: "carrier-12",
    name: "Great Plains Trucking",
    mcNumber: "MC-334875",
    phone: "+1 402 555 0171",
    rating: 4.6,
  },
  {
    id: "carrier-13",
    name: "Harborline Logistics",
    mcNumber: "MC-812047",
    phone: "+1 206 555 0195",
    rating: 4.8,
  },
  {
    id: "carrier-14",
    name: "Pioneer Freight Co",
    mcNumber: "MC-158690",
    phone: "+1 801 555 0162",
    rating: 4.1,
  },
  {
    id: "carrier-15",
    name: "Keystone Roadways",
    mcNumber: "MC-973410",
    phone: "+1 215 555 0126",
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
  ["Seattle", "WA", "98101"],
  ["Portland", "OR", "97201"],
  ["Kansas City", "MO", "64106"],
  ["Nashville", "TN", "37201"],
  ["Minneapolis", "MN", "55401"],
  ["Philadelphia", "PA", "19103"],
  ["Salt Lake City", "UT", "84101"],
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
  "Hearthside Goods",
  "Meridian Supply",
  "Oak & Field Markets",
  "Atlas Components",
  "Silverline Retail",
];

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function stop(
  id: string,
  order: number,
  cityIndex: number,
  type: Stop["type"],
  pickupDate: Date,
): Stop {
  const [city, state, zip] = cities[cityIndex % cities.length];
  const appointmentDate = new Date(pickupDate);
  appointmentDate.setDate(pickupDate.getDate() + order - 1);

  return {
    id,
    type,
    order,
    address: { city, state, zip },
    locationName: `${city} Terminal`,
    appointmentType:
      order % 3 === 0 ? "fcfs" : order % 2 === 0 ? "window" : "fixed",
    appointmentDate: toDateInput(appointmentDate),
    notes: "",
  };
}

function statusHistoryFor(
  status: OrderStatus,
  createdAt: string,
  index: number,
): StatusChange[] {
  const firstPickupAt = new Date(createdAt);
  firstPickupAt.setHours(firstPickupAt.getHours() + 3 + (index % 4));
  const completedAt = new Date(firstPickupAt);
  completedAt.setDate(firstPickupAt.getDate() + 2 + (index % 3));

  if (status === "pending") {
    return [
      {
        from: null,
        to: "pending",
        changedAt: createdAt,
        note: "Draft submitted",
      },
      {
        from: "pending",
        to: "pending",
        changedAt: firstPickupAt.toISOString(),
        note: "Carrier confirmation requested",
      },
    ];
  }

  if (status === "in_transit") {
    return [
      {
        from: null,
        to: "pending",
        changedAt: createdAt,
        note: "Draft submitted",
      },
      {
        from: "pending",
        to: "in_transit",
        changedAt: firstPickupAt.toISOString(),
        note: "Picked up",
      },
    ];
  }

  if (status === "delivered") {
    return [
      {
        from: null,
        to: "pending",
        changedAt: createdAt,
        note: "Draft submitted",
      },
      {
        from: "pending",
        to: "in_transit",
        changedAt: firstPickupAt.toISOString(),
        note: "Picked up",
      },
      {
        from: "in_transit",
        to: "delivered",
        changedAt: completedAt.toISOString(),
        note: "POD received",
      },
    ];
  }

  return [
    {
      from: null,
      to: "pending",
      changedAt: createdAt,
      note: "Draft submitted",
    },
    ...(index % 2 === 0
      ? [
          {
            from: "pending" as const,
            to: "in_transit" as const,
            changedAt: firstPickupAt.toISOString(),
            note: "Picked up",
          },
        ]
      : []),
    {
      from: index % 2 === 0 ? "in_transit" : "pending",
      to: "cancelled",
      changedAt: completedAt.toISOString(),
      note: "Cancelled by customer",
    },
  ];
}

export function createSeedOrders(): Order[] {
  return Array.from({ length: 34 }).map((_, index) => {
    const carrier = carriers[index % carriers.length];
    const status = statuses[index % statuses.length];
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - (index % 60));
    createdDate.setHours(9 + (index % 6), 0, 0, 0);
    const createdAt = createdDate.toISOString();
    const pickupDate = new Date(createdDate);
    pickupDate.setDate(createdDate.getDate() + 1);
    const stopsCount = 2 + (index % 4);
    const stops = Array.from({ length: stopsCount }).map((_, stopIndex) => {
      const stopOrder = stopIndex + 1;
      const type =
        stopIndex === 0
          ? "pick_up"
          : stopIndex === stopsCount - 1
            ? "drop_off"
            : "stop";

      return stop(
        `stop-${index}-${stopOrder}`,
        stopOrder,
        index + stopIndex,
        type,
        pickupDate,
      );
    });

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
      statusHistory: statusHistoryFor(status, createdAt, index),
      createdAt,
      updatedAt: createdAt,
    };
  });
}
