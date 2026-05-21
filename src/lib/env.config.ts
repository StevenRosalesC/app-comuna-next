import * as z from 'zod';

const envSchema = z
  .object({
    API_URL: z.string().min(1, { message: 'API_URL is required' }),
    NEXT_PUBLIC_APP_URL: z
      .string()
      .min(1, { message: 'NEXT_PUBLIC_APP_URL is required' }),
    NEXT_PUBLIC_CACHE_REVALIDATE: z.string().optional(),

    STORAGE_PROVIDER: z.enum(['imagekit', 'minio']).optional(),

    IMAGEKIT_URL_ENDPOINT: z.string().optional(),
    IMAGEKIT_PRIVATE_KEY: z.string().optional(),
    IMAGEKIT_PUBLIC_KEY: z.string().optional(),

    MINIO_ENDPOINT: z.string().optional(),
    MINIO_ACCESS_KEY: z.string().optional(),
    MINIO_SECRET_KEY: z.string().optional(),
    MINIO_REGION: z.string().optional(),
    MINIO_BUCKET: z.string().optional(),
    MINIO_PUBLIC_URL: z.string().optional()
  })
  .superRefine((value, ctx) => {
    const provider = value.STORAGE_PROVIDER || 'imagekit';
    if (provider === 'imagekit') {
      if (!value.IMAGEKIT_URL_ENDPOINT) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IMAGEKIT_URL_ENDPOINT is required when STORAGE_PROVIDER=imagekit',
          path: ['IMAGEKIT_URL_ENDPOINT']
        });
      }
      if (!value.IMAGEKIT_PRIVATE_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IMAGEKIT_PRIVATE_KEY is required when STORAGE_PROVIDER=imagekit',
          path: ['IMAGEKIT_PRIVATE_KEY']
        });
      }
      if (!value.IMAGEKIT_PUBLIC_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IMAGEKIT_PUBLIC_KEY is required when STORAGE_PROVIDER=imagekit',
          path: ['IMAGEKIT_PUBLIC_KEY']
        });
      }
      return;
    }

    if (!value.MINIO_ENDPOINT) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'MINIO_ENDPOINT is required when STORAGE_PROVIDER=minio',
        path: ['MINIO_ENDPOINT']
      });
    }
    if (!value.MINIO_ACCESS_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'MINIO_ACCESS_KEY is required when STORAGE_PROVIDER=minio',
        path: ['MINIO_ACCESS_KEY']
      });
    }
    if (!value.MINIO_SECRET_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'MINIO_SECRET_KEY is required when STORAGE_PROVIDER=minio',
        path: ['MINIO_SECRET_KEY']
      });
    }
    if (!value.MINIO_BUCKET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'MINIO_BUCKET is required when STORAGE_PROVIDER=minio',
        path: ['MINIO_BUCKET']
      });
    }
    if (!value.MINIO_PUBLIC_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'MINIO_PUBLIC_URL is required when STORAGE_PROVIDER=minio',
        path: ['MINIO_PUBLIC_URL']
      });
    }
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
  STORAGE_PROVIDER,
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT,
  IMAGEKIT_PUBLIC_KEY,
  MINIO_ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_REGION,
  MINIO_BUCKET,
  MINIO_PUBLIC_URL,
  NEXT_PUBLIC_CACHE_REVALIDATE
} = env.data;
