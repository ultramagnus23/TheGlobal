import { z } from "zod";

export const enquiryFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a 10-digit mobile number."),
  city: z.string().min(2, "Please enter your city."),
  role: z.enum(["dealer", "builder", "architect", "contractor", "homeowner"], {
    message: "Please select who you are.",
  }),
  interest: z.enum(["astral", "somany", "both"], {
    message: "Please select what you're interested in.",
  }),
  message: z.string().optional(),
  // Honeypot — must stay empty. Real users never see or fill this field.
  company: z.string().max(0).optional(),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

export const roleOptions: Array<{ value: EnquiryFormValues["role"]; label: string }> = [
  { value: "dealer", label: "Dealer" },
  { value: "builder", label: "Builder" },
  { value: "architect", label: "Architect" },
  { value: "contractor", label: "Contractor" },
  { value: "homeowner", label: "Homeowner" },
];

export const interestOptions: Array<{ value: EnquiryFormValues["interest"]; label: string }> = [
  { value: "astral", label: "Astral (pipes & plumbing)" },
  { value: "somany", label: "Somany (tiles & sanitaryware)" },
  { value: "both", label: "Both" },
];
