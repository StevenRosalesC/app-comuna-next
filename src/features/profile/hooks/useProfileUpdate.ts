import { useState } from 'react';
import { useSessionContext } from '@/components/providers/session-Provider';

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
  const response = await fetch('/api/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(Array.isArray(error.message) ? error.message.join(', ') : error.message);
  }

  return response.json();
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