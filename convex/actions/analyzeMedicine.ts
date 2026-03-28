"use node";

import { actionGeneric, anyApi } from "convex/server";
import { v } from "convex/values";

import {
  cloneFallbackAnalysis,
  formatMedicineName,
  medicineAnalysisFields,
  medicineAnalysisJsonSchema,
  normalizeMedicineName,
  sanitizeMedicineAnalysis,
} from "../lib/medicine";

const geminiModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";

export const analyzeMedicine = actionGeneric({
  args: {
    medicineName: v.string(),
    userId: v.optional(v.string()),
  },
  returns: v.object({
    name: v.string(),
    ...medicineAnalysisFields,
    source: v.union(
      v.literal("cache"),
      v.literal("gemini"),
      v.literal("fallback"),
    ),
    cached: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const displayName = formatMedicineName(args.medicineName);
    const searchKey = normalizeMedicineName(args.medicineName);

    if (!searchKey) {
      return {
        name: displayName || "Unknown medicine",
        ...cloneFallbackAnalysis(),
        source: "fallback" as const,
        cached: false,
      };
    }

    const cachedMedicine = (await ctx.runQuery(
      anyApi.queries.getMedicine.bySearchKey,
      {
        searchKey,
      },
    )) as Record<string, unknown> | null;

    if (cachedMedicine) {
      const analysis = sanitizeMedicineAnalysis(cachedMedicine);

      return {
        name: getCachedMedicineName(cachedMedicine, displayName),
        ...analysis,
        source: "cache" as const,
        cached: true,
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        name: displayName,
        ...cloneFallbackAnalysis(),
        source: "fallback" as const,
        cached: false,
      };
    }

    try {
      const analysis = await fetchMedicineAnalysisFromGemini(
        displayName,
        args.userId,
      );

      await ctx.runMutation(anyApi.mutations.saveMedicine.upsert, {
        name: displayName,
        searchKey,
        ...analysis,
        createdAt: Date.now(),
      });

      return {
        name: displayName,
        ...analysis,
        source: "gemini" as const,
        cached: false,
      };
    } catch (error) {
      console.error("analyzeMedicine failed", {
        medicineName: displayName,
        error,
      });

      return {
        name: displayName,
        ...cloneFallbackAnalysis(),
        source: "fallback" as const,
        cached: false,
      };
    }
  },
});

async function fetchMedicineAnalysisFromGemini(
  medicineName: string,
  _userId?: string,
) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: "You are a careful medicine information assistant for a healthcare app used in India. Return only JSON that matches the schema. Keep the language simple, cautious, and safe. Give general information only, not patient-specific advice. If the medicine is unclear, state that clearly and tell the user to confirm with a doctor or pharmacist.",
            },
          ],
        },
        contents: [
          {
            parts: [
              {
                text: `Medicine: ${medicineName}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseJsonSchema: medicineAnalysisJsonSchema,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Gemini request failed with status ${response.status}: ${await response.text()}`,
    );
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const content = payload.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("Gemini returned an empty medicine analysis payload.");
  }

  return sanitizeMedicineAnalysis(JSON.parse(content));
}

function getCachedMedicineName(
  cachedMedicine: Record<string, unknown>,
  fallbackName: string,
): string {
  if (typeof cachedMedicine.name !== "string") {
    return fallbackName;
  }

  const normalizedName = cachedMedicine.name.trim();
  return normalizedName.length > 0 ? normalizedName : fallbackName;
}
