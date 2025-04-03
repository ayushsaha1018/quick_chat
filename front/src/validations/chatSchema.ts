import { z } from "zod";

export const createChatSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(50, { message: "Title must be less than 50 characters" }),
});

export type createChatSchemaType = z.infer<typeof createChatSchema>;
