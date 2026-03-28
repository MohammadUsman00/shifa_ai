import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

import { medicineAnalysisFields } from "../lib/medicine";

export const upsert = mutationGeneric({
  args: {
    name: v.string(),
    searchKey: v.string(),
    ...medicineAnalysisFields,
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existingMedicine = await ctx.db
      .query("medicines")
      .withIndex("by_search_key", (query) =>
        query.eq("searchKey", args.searchKey),
      )
      .first();

    if (existingMedicine) {
      await ctx.db.patch(existingMedicine._id, {
        name: args.name,
        searchKey: args.searchKey,
        purpose: args.purpose,
        dosage: args.dosage,
        precautions: args.precautions,
        sideEffects: args.sideEffects,
        timing: args.timing,
      });

      return existingMedicine._id;
    }

    return ctx.db.insert("medicines", args);
  },
});
