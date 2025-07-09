import { useState } from 'react';
import { useSessionContext } from '@/components/providers/session-Provider';
import apiCommunity from '@/utils/communityApi';

interface UpdateProfileRequest {
  username?: string;
  password?: string;
  email?: string;
}

interface UpdateProfileResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: Record<string, string[]>;
}

const updateUserProfile = async (
  profileData: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  try {
    const response = await apiCommunity.patch('/users/me', profileData);  
  
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useProfileUpdate = () => {
  const { session, setSession } = useSessionContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (profileData: UpdateProfileRequest) => {
    setLoading(true);
    setError(null);

    try {
      const updatedProfile = await updateUserProfile(profileData);
      
      // Update session with new data
      if (session) {
        setSession({
          ...session,
          username: updatedProfile.username,
          email: updatedProfile.email,
        });
      }
      
      return updatedProfile;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
}; 