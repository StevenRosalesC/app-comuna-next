import { createClient } from '@/utils/supabase/server';
import { CustomSession } from 'types';

export const signIn = async ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

export const auth = async (): Promise<CustomSession | null> => {
  const supabase = await createClient();

  // Obtén el usuario autenticado de forma segura
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return null;
  }

  const userId = userData.user.id;

  // Obtén datos adicionales del usuario desde la base de datos
  const { data: allUserData, error: dataError } = await supabase
    .from('users')
    .select(
      `
        *,
        roles(*),
        user_projects(*,
          projects(*)
        )
      `
    )
    .eq('id', userId)
    .single();
  if (
    dataError ||
    !allUserData ||
    !allUserData.roles ||
    !allUserData.user_projects
  ) {
    return null;
  }
  return {
    ...userData,
    username: allUserData.name,
    roles: allUserData.roles,
    user_projects: allUserData.user_projects
  };
};
