import * as z from 'zod';

// Esquema de validación para las variables de entorno
const envSchema = z.object({
  GITHUB_ID: z.string({
    required_error: 'GITHUB_ID is required'
  }),
  GITHUB_SECRET: z.string({
    required_error: 'GITHUB_SECRET is required'
  }),
  API_URL: z.string({
    required_error: 'API_URL is required'
  }),
  SUPABASE_URL: z.string({
    required_error: 'SUPABASE_URL is required'
  }),
  SUPABASE_ANON_KEY: z.string({
    required_error: 'SUPABASE_ANON_KEY is required'
  })
});

// Validar las variables de entorno
const env = envSchema.safeParse(process.env);
if (!env.success) {
  throw new Error(`Invalid environment variables: ${env.error}`);
}

// Exportar las variables validadas
export const {
  GITHUB_ID,
  GITHUB_SECRET,
  API_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} = env.data;
