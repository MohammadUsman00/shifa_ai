import { queryGeneric } from "convex/server";
import { v } from "convex/values";

export const bySearchKey = queryGeneric({
  args: {
    searchKey: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("medicines")
      .withIndex("by_search_key", (query) =>
        query.eq("searchKey", args.searchKey),
      )
      .first();
  },
});
