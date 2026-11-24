import { z } from "zod";

export const joinWorkshopSchema = z.object({
  pin: z
    .string()
    .trim()
    .min(4, "Le code PIN doit contenir au moins 4 caractères.")
    .max(20, "Code PIN invalide."),
  displayName: z
    .string()
    .trim()
    .min(2, "Veuillez saisir votre prénom ou nom affiché (2 caractères min.).")
    .max(40, "Maximum 40 caractères.")
    .refine(
      (val) => !/@/.test(val) && !/\b0[5-7]\d{8}\b/.test(val.replace(/\s+/g, "")),
      "Veuillez saisir uniquement un prénom ou nom affiché (sans e-mail ni numéro de téléphone)."
    ),
});

export const presenterLoginSchema = z.object({
  passcode: z
    .string()
    .trim()
    .min(4, "Code d'accès requis.")
    .max(100, "Code trop long."),
});

export const presenterControlSchema = z.object({
  currentSlideId: z.string().min(1).max(60).optional(),
  currentSection: z.number().int().min(1).max(12).optional(),
  activeActivityKey: z.string().min(1).max(60).nullable().optional(),
  activityStatus: z.enum(["idle", "open", "closed", "revealed"]).optional(),
  showResults: z.boolean().optional(),
  showQrOverlay: z.boolean().optional(),
  isPaused: z.boolean().optional(),
  demoMode: z.boolean().optional(),
  timerAction: z.enum(["start", "pause", "reset"]).optional(),
});

export const resetActivitySchema = z.object({
  activityKey: z.string().trim().min(1).max(60),
});

export const purgeParticipantsSchema = z.object({
  confirmation: z.literal("SUPPRIMER"),
});

export const participantResponseSchema = z.object({
  activityKey: z.string().trim().min(1).max(60),
  itemKey: z.string().trim().min(1).max(40).default("main"),
  selectedOption: z.string().trim().min(1).max(120).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const galleryContributionSchema = z.object({
  contributorName: z
    .string()
    .trim()
    .min(2, "Nom ou prénom requis.")
    .max(60, "Maximum 60 caractères."),
  appTitle: z
    .string()
    .trim()
    .min(3, "Titre de l'application requis.")
    .max(100, "Maximum 100 caractères."),
  gradeRange: z.string().trim().min(2).max(40),
  discipline: z.string().trim().min(2).max(60),
  language: z.string().trim().min(2).max(40),
  learningObjective: z
    .string()
    .trim()
    .min(8, "Précisez l'objectif d'apprentissage.")
    .max(300),
  description: z
    .string()
    .trim()
    .min(10, "Décrivez brièvement votre prototype.")
    .max(500),
  classroomInstructions: z
    .string()
    .trim()
    .min(6, "Indiquez comment l'utiliser en classe.")
    .max(400),
  appResource: z
    .string()
    .trim()
    .min(3, "Indiquez le lien, fichier ou prototype.")
    .max(250),
  testedFeatures: z.array(z.string().trim().min(1).max(80)).min(1).max(8),
  privacyConfirmed: z
    .boolean()
    .refine((v) => v === true, "La confirmation d'absence de données personnelles d'élèves est obligatoire."),
});
