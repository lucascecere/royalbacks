import { z } from 'zod'

export const QuoteStep1Schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
})

export const QuoteStep2Schema = z.object({
  garment_type: z.enum(['hats', 'polos', 't-shirts', 'sweatshirts', 'jackets', 'bags', 'other']),
  quantity: z.number().min(1).max(10000),
  colors_count: z.number().min(1).max(15),
  notes: z.string().optional(),
})

export const QuoteStep3Schema = z.object({
  has_artwork: z.boolean(),
  artwork_description: z.string().optional(),
  artwork_format: z.enum(['ai', 'pdf', 'png', 'jpg', 'other', 'need_design']).optional(),
})

export const QuoteStep4Schema = z.object({
  deadline: z.enum(['asap', '1_week', '2_weeks', '1_month', 'flexible']),
  budget_range: z.enum(['under_500', '500_1000', '1000_2500', '2500_plus', 'not_sure']),
})

export const QuoteFormSchema = QuoteStep1Schema
  .merge(QuoteStep2Schema)
  .merge(QuoteStep3Schema)
  .merge(QuoteStep4Schema)

export type QuoteFormData = z.infer<typeof QuoteFormSchema>
export type QuoteStep1Data = z.infer<typeof QuoteStep1Schema>
export type QuoteStep2Data = z.infer<typeof QuoteStep2Schema>
export type QuoteStep3Data = z.infer<typeof QuoteStep3Schema>
export type QuoteStep4Data = z.infer<typeof QuoteStep4Schema>
