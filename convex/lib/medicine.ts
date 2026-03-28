import { v } from "convex/values";

export type MedicineAnalysis = {
  purpose: string;
  dosage: string;
  precautions: string[];
  sideEffects: string[];
  timing: string[];
};

export const medicineAnalysisFields = {
  purpose: v.string(),
  dosage: v.string(),
  precautions: v.array(v.string()),
  sideEffects: v.array(v.string()),
  timing: v.array(v.string()),
} as const;

export const medicineAnalysisValidator = v.object(medicineAnalysisFields);

export const medicineAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["purpose", "dosage", "precautions", "sideEffects", "timing"],
  properties: {
    purpose: {
      type: "string",
      description:
        "A simple explanation of what the medicine is commonly used for.",
    },
    dosage: {
      type: "string",
      description:
        "A short, general dosage summary. Do not include patient-specific advice.",
    },
    precautions: {
      type: "array",
      items: { type: "string" },
      description:
        "Important precautions or warnings in simple language.",
    },
    sideEffects: {
      type: "array",
      items: { type: "string" },
      description: "Common side effects in simple language.",
    },
    timing: {
      type: "array",
      items: { type: "string" },
      description:
        "General timing guidance such as after food, once daily, or as prescribed.",
    },
  },
} as const;

export const FALLBACK_MEDICINE_ANALYSIS: MedicineAnalysis = {
  purpose:
    "Medicine information could not be confirmed automatically right now.",
  dosage:
    "Please check the prescription label or ask a doctor or pharmacist before taking it.",
  precautions: [
    "Do not start or change the dose without professional advice.",
    "Avoid mixing medicines unless a doctor or pharmacist confirms it is safe.",
  ],
  sideEffects: [
    "Side effects may vary by medicine and your health condition.",
    "Get medical help quickly if you have breathing trouble, swelling, or a severe rash.",
  ],
  timing: [
    "Follow the prescription label or your doctor's instructions.",
    "If timing is unclear, confirm with a pharmacist before taking the next dose.",
  ],
};

export function normalizeMedicineName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export function formatMedicineName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function sanitizeMedicineAnalysis(value: unknown): MedicineAnalysis {
  if (!isRecord(value)) {
    return cloneFallbackAnalysis();
  }

  return {
    purpose: sanitizeString(
      value.purpose,
      FALLBACK_MEDICINE_ANALYSIS.purpose,
    ),
    dosage: sanitizeString(value.dosage, FALLBACK_MEDICINE_ANALYSIS.dosage),
    precautions: sanitizeStringArray(
      value.precautions,
      FALLBACK_MEDICINE_ANALYSIS.precautions,
    ),
    sideEffects: sanitizeStringArray(
      value.sideEffects,
      FALLBACK_MEDICINE_ANALYSIS.sideEffects,
    ),
    timing: sanitizeStringArray(value.timing, FALLBACK_MEDICINE_ANALYSIS.timing),
  };
}

export function cloneFallbackAnalysis(): MedicineAnalysis {
  return {
    purpose: FALLBACK_MEDICINE_ANALYSIS.purpose,
    dosage: FALLBACK_MEDICINE_ANALYSIS.dosage,
    precautions: [...FALLBACK_MEDICINE_ANALYSIS.precautions],
    sideEffects: [...FALLBACK_MEDICINE_ANALYSIS.sideEffects],
    timing: [...FALLBACK_MEDICINE_ANALYSIS.timing],
  };
}

function sanitizeString(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function sanitizeStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return cleaned.length > 0 ? cleaned : [...fallback];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
