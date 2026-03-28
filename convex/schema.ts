import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { medicineAnalysisValidator, medicineAnalysisFields } from "./lib/medicine";

export default defineSchema(
  {
    users: defineTable({
      name: v.string(),
      email: v.string(),
      image: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_email", ["email"]),

    medicines: defineTable({
      name: v.string(),
      searchKey: v.string(),
      ...medicineAnalysisFields,
      createdAt: v.number(),
    })
      .index("by_search_key", ["searchKey"])
      .index("by_name", ["name"]),

    queries: defineTable({
      userId: v.string(),
      medicineName: v.string(),
      response: medicineAnalysisValidator,
      createdAt: v.number(),
    })
      .index("by_user_id", ["userId"])
      .index("by_user_id_and_created_at", ["userId", "createdAt"]),

    appointments: defineTable({
      userId: v.string(),
      doctorName: v.string(),
      date: v.string(),
      time: v.string(),
      status: v.string(),
    })
      .index("by_user_id", ["userId"])
      .index("by_user_id_and_date", ["userId", "date"]),

    reminders: defineTable({
      userId: v.string(),
      medicineName: v.string(),
      time: v.string(),
      taken: v.boolean(),
    })
      .index("by_user_id", ["userId"])
      .index("by_user_id_and_time", ["userId", "time"]),
  },
  {
    schemaValidation: true,
  },
);
