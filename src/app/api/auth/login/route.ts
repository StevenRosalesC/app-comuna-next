import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (email === ''){
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  if (password === ''){
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Login successful' });
}
