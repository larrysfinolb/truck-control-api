import 'dotenv/config';
import { z } from 'zod';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const envsSchema = z.object({
  PORT: z.coerce.number().min(1),
  DATABASE_URL: z.string().min(1),
});

const parsedEnv = envsSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

const envsVars: EnvVars = parsedEnv.data;

export const envs = Object.freeze({
  port: envsVars.PORT,
  database: {
    url: envsVars.DATABASE_URL,
  },
});
