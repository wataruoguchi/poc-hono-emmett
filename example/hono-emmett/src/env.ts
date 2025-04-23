import { z } from "zod";

export const env = z
  .object({
    PGHOST: z.string(),
    PGPORT: z.string().transform((val) => Number.parseInt(val)),
    PGUSER: z.string(),
    PGPASSWORD: z.string(),
    PGDATABASE: z.string(),
  })
  .parse(process.env);
