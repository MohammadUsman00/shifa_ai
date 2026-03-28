import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const upsertByEmail = mutationGeneric({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.trim().toLowerCase();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (query) => query.eq("email", normalizedEmail))
      .first();

    if (existingUser) {
      const patch: { name: string; email: string; image?: string } = {
        name: args.name,
        email: normalizedEmail,
      };

      if (args.image !== undefined) {
        patch.image = args.image;
      }

      await ctx.db.patch(existingUser._id, patch);
      return existingUser._id;
    }

    return ctx.db.insert("users", {
      name: args.name,
      email: normalizedEmail,
      image: args.image,
      createdAt: Date.now(),
    });
  },
});
