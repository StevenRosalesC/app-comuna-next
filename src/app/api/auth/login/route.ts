import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (email === '' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return NextResponse.json(
      { error: 'Valid email is required' },
      { status: 400 }
    );
  }

  if (password === '') {
    return NextResponse.json(
      { error: 'Password is required' },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: 'Login successful' });
}
