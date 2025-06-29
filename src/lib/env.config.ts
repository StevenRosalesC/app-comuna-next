import * as z from 'zod';

// Esquema de validación para las variables de entorno
const envSchema = z.object({
  API_URL: z.string({
    required_error: 'API_URL is required'
  }),
  NEXT_PUBLIC_APP_URL: z.string({
    required_error: 'NEXT_PUBLIC_APP_URL is required'
  }),
  IMAGEKIT_URL_ENDPOINT: z.string({
    required_error: 'IMAGEKIT_URL_ENDPOINT is required'
  }),
  IMAGEKIT_PRIVATE_KEY: z.string({
    required_error: 'IMAGEKIT_PRIVATE_KEY is required'
  }),
  IMAGEKIT_PUBLIC_KEY: z.string({
    required_error: 'IMAGEKIT_PUBLIC_KEY is required'
  })
});

// Validar las variables de entorno
const env = envSchema.safeParse(process.env);
if (!env.success) {
  throw new Error(`Invalid environment variables `);
}

// Exportar las variables validadas
export const {
  API_URL,
  NEXT_PUBLIC_APP_URL,
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT,
  IMAGEKIT_PUBLIC_KEY
} = env.data;
