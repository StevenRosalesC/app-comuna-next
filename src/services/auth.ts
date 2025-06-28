import apiCommunity from '@/utils/communityApi';

export const AuthService = {
  forgotPassword: async (email: string) => {
    try {
      const response = await apiCommunity.post('/auth/forgot-password', {
        email
      });
      return response.data;
    } catch (error) {
      throw new Error(
        'Error al enviar el correo de recuperación de contraseña'
      );
    }
  },
  validateToken: async (token: string) => {
    try {
      const response = await apiCommunity.get(`/auth/validate-token/${token}`);
      return response;
    } catch (error) {
      throw new Error('Error al validar el token');
    }
  },
  resetPassword: async (
    token: string,
    { newPassword }: { newPassword: string }
  ) => {
    try {
      const response = await apiCommunity.post(
        `/auth/reset-password/${token}`,
        {
          newPassword
        }
      );
      return response;
    } catch (error) {
      throw new Error('Error al restablecer la contraseña');
    }
  }
};
