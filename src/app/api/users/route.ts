import supabase from '@/utils/db';
import { AuthResponse } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json(
      { error: 'Request body is null' },
      { status: 400 }
    );
  }
  const { userName, email, password } = await request.json();
  const response: AuthResponse = await supabase.auth.signUp({
    email,
    password
  });

  if (response.error) {
    return NextResponse.json(response, { status: 400 });
  }
  // update user role to admin

  if (!response.data?.user?.id) {
    return NextResponse.json(
      { error: 'User ID is undefined' },
      { status: 400 }
    );
  }

  const newUser = await supabase
    .from('users')
    .insert({
      id: response.data?.user?.id,
      name: userName,
      role_id: '31717b1e-224a-4738-b625-5c5574d95d2d'
    })
    .single();

  return NextResponse.json(newUser, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json(
      { error: 'Request body is null' },
      { status: 400 }
    );
  }
  const { data, error } = await supabase.auth.admin.deleteUser(
    'f31c335d-9633-4f25-a0de-9be1a76e19f6'
  );
  return NextResponse.json({ data, error }, { status: 200 });
}
