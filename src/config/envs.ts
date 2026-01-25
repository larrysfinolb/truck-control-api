import 'dotenv/config';
import { z } from 'zod';

interface EnvVars {
  PORT: number;
}

const envsSchema = z.object({
  PORT: z.coerce.number().min(1),
});

const parsedEnv = envsSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

const envsVars = parsedEnv.data;

export const envs: EnvVars = {
  PORT: envsVars.PORT,
};
