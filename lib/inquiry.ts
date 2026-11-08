import { z } from 'zod';

export const inquirySchema = z.object({
  requestId: z.string().uuid(),
  name: z.string().trim().min(2, 'יש להזין שם מלא').max(100),
  phone: z.string().trim().regex(/^[+\d\s().-]{8,24}$/, 'יש להזין מספר טלפון תקין').refine(value => { const digits=value.replace(/\D/g, ''); return digits.length>=8 && digits.length<=15; }, 'יש להזין מספר טלפון תקין'),
  email: z.string().trim().email('יש להזין כתובת דוא״ל תקינה').max(180),
  interest: z.string().trim().max(100).default(''),
  message: z.string().trim().max(3000, 'אפשר לכתוב עד 3,000 תווים').default(''),
  website: z.string().max(200).default(''),
});
export type Inquiry = z.infer<typeof inquirySchema>;
