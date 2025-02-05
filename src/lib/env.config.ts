import * as z from 'zod';

// Esquema de validación para las variables de entorno
const envSchema = z.object({
  API_URL: z.string({
    required_error: 'API_URL is required'
  }),
  NEXT_PUBLIC_APP_URL: z.string({
    required_error: 'NEXT_PUBLIC_APP_URL is required'
  })
});

// Validar las variables de entorno
const env = envSchema.safeParse(process.env);
if (!env.success) {
  throw new Error(`Invalid environment variables: ${env.error}`);
}

// Exportar las variables validadas
export const { API_URL,NEXT_PUBLIC_APP_URL } = env.data;
