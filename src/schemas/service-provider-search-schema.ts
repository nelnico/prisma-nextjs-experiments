import { z } from "zod";

export const serviceProviderSearchSchema = z.object({
  page: z.number().optional().default(0),
  size: z.number().optional().default(20),
  query: z.string().optional(),
  genderId: z.number().optional(),
  provinceIds: z.array(z.number()).optional(),
  ageRange: z.array(z.number()).optional(),
  isMarried: z.boolean().optional(),
  hasChildren: z.boolean().optional(),
});

export type ServiceProviderSearchFormData = z.infer<
  typeof serviceProviderSearchSchema
>;
