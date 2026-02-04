import { z } from "zod";

// Get today's date at midnight for comparison
const getTodayMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// TRF Form Validation Schema
export const trfBasicInfoSchema = z.object({
  priority: z.enum(["urgent", "high", "normal", "low"], {
    required_error: "Please select a priority level",
  }),
  testingLevel: z.enum(["level1", "level2", "level3", "level4", "level5"], {
    required_error: "Please select a testing level",
  }),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((val) => {
      const selectedDate = new Date(val);
      return selectedDate >= getTodayMidnight();
    }, "Due date must be today or in the future"),
  notes: z
    .string()
    .max(1000, "Notes must be 1000 characters or less")
    .optional()
    .default(""),
});

export const trfStyleManualSchema = z.object({
  styleName: z
    .string()
    .min(1, "Style name is required")
    .max(100, "Style name must be 100 characters or less")
    .trim(),
  styleNumber: z
    .string()
    .min(1, "Style number is required")
    .max(9, "Style number must be 9 characters or less")
    .regex(/^\d{1,9}$/, "Style number must be numeric (up to 9 digits)"),
  designStyleRef: z
    .string()
    .max(50, "Design style ref must be 50 characters or less")
    .optional()
    .default(""),
  category: z.string().optional().default(""),
});

export const trfStyleLinkedSchema = z.object({
  linkedStyleId: z.string().min(1, "Please select a style"),
});

export const trfSupplierLabSchema = z.object({
  supplierId: z.string().min(1, "Please select a supplier"),
  labId: z.string().min(1, "Please select a testing lab"),
});

export const trfTestingSchema = z.object({
  testTypes: z
    .array(z.string())
    .min(1, "Please select at least one test type"),
  specialInstructions: z
    .string()
    .max(2000, "Special instructions must be 2000 characters or less")
    .optional()
    .default(""),
});

export const trfSampleDescriptionSchema = z.object({
  sampleDescription: z
    .string()
    .max(500, "Sample description must be 500 characters or less")
    .optional()
    .default(""),
});

// Validation helper functions
export const validateBasicInfo = (data: {
  priority: string;
  testingLevel: string;
  dueDate: string;
  notes: string;
}) => {
  return trfBasicInfoSchema.safeParse(data);
};

export const validateStyleManual = (data: {
  styleName: string;
  styleNumber: string;
  designStyleRef: string;
  category: string;
}) => {
  return trfStyleManualSchema.safeParse(data);
};

export const validateStyleLinked = (data: { linkedStyleId: string }) => {
  return trfStyleLinkedSchema.safeParse(data);
};

export const validateSupplierLab = (data: {
  supplierId: string;
  labId: string;
}) => {
  return trfSupplierLabSchema.safeParse(data);
};

export const validateTesting = (data: {
  testTypes: string[];
  specialInstructions: string;
}) => {
  return trfTestingSchema.safeParse(data);
};

// Type exports
export type TRFBasicInfo = z.infer<typeof trfBasicInfoSchema>;
export type TRFStyleManual = z.infer<typeof trfStyleManualSchema>;
export type TRFStyleLinked = z.infer<typeof trfStyleLinkedSchema>;
export type TRFSupplierLab = z.infer<typeof trfSupplierLabSchema>;
export type TRFTesting = z.infer<typeof trfTestingSchema>;
