import { z } from "zod";

const InvestorformSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  type: z.string().min(2, "This field is required"),
  industry: z.array(z.string()).min(1, "This field is required"),
  fundingStage: z.array(z.string()).min(1, "This field is required"),
  groups: z.array(z.string()).optional(),
  preferredLocation: z.array(z.string()).min(1, "This field is required"),
  jobTitle: z.string().min(1, "This field is required"),
  mobileNumber: z.string().min(8, "Please enter a valid mobile number"),
  linkedinUrl: z
    .string()
    .min(2, "Linkedin URL is required")
    .regex(
      /^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/,
      "Please enter a valid LinkedIn URL"
    ),
  fundingDeployed: z.string().optional(),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(400, {
      message: "Bio must not be longer than 300 characters.",
    })
    .optional(),
  imageUrl: z.string().optional(),
});

export { InvestorformSchema };
