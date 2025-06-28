import { z } from 'zod';
import apiCommunity from '@/utils/communityApi';
import { AxiosError } from 'axios';

// You can reuse the schema from your form or define it here
const contactSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  message: z.string().min(10)
});

type ContactForm = z.infer<typeof contactSchema>;

/**
 * Sends the contact form data using the apiCommunity instance.
 * @param data The contact form data.
 */
export const sendContactMessage = async (data: ContactForm): Promise<void> => {
  try {
    await apiCommunity.post('/contact', data);
  } catch (error) {
    if (error instanceof AxiosError) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response) {
        throw new Error(
          error.response.data.message || 'El servidor rechazó la solicitud.'
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No se pudo conectar con el servidor.');
      }
    }
    // Something happened in setting up the request that triggered an Error
    throw new Error('Ocurrió un error inesperado.');
  }
};
