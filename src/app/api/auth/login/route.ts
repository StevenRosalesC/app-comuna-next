import { NextResponse } from 'next/server';
import supabase from '@/utils/db'; // Asegúrate de tener configurado el cliente de Supabase
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Llamada a Supabase para iniciar sesión
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Devuelve los datos de la sesión
  return NextResponse.json({ user: data?.user, session: data?.session });
}
