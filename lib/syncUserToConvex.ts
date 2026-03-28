import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

type SyncUserArgs = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const saveUserReference = makeFunctionReference<
  "mutation",
  {
    name: string;
    email: string;
    image?: string;
  },
  string
>("mutations/saveUser:upsertByEmail");

export async function syncUserToConvex(user: SyncUserArgs) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const email = user.email?.trim().toLowerCase();

  if (!convexUrl || !email) {
    return;
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    await client.mutation(saveUserReference, {
      name: user.name?.trim() || email,
      email,
      image: user.image ?? undefined,
    });
  } catch (error) {
    console.error("Failed to sync Google user to Convex.", error);
  }
}
