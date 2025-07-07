import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { AUTH_CONFIG } from '@/lib/auth-config';

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

export async function PATCH(request: NextRequest) {
  try {
    // Get the current session using the custom auth function
    const { ok, data: session } = await auth();
    
    if (!ok || !session) {
      return NextResponse.json(
        { statusCode: 401, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body: UpdateProfileRequest = await request.json();
    
    // Validate that at least one field is provided
    if (!body.username && !body.password && !body.email) {
      return NextResponse.json(
        { statusCode: 400, message: 'At least one field must be provided' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { statusCode: 400, message: 'Please provide a valid email address' },
          { status: 400 }
        );
      }
    }

    // Validate password length if provided
    if (body.password && body.password.length < 6) {
      return NextResponse.json(
        { statusCode: 400, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate username length if provided
    if (body.username && body.username.length < 3) {
      return NextResponse.json(
        { statusCode: 400, message: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Get the token for the API call
    const token = cookies().get(AUTH_CONFIG.COOKIE_NAME)?.value;
    
    if (!token) {
      return NextResponse.json(
        { statusCode: 401, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Here you would typically make a call to your backend API
    // For now, we'll simulate the update
    const updatedProfile: UpdateProfileResponse = {
      id: session.id,
      username: body.username || session.username,
      email: body.email || session.email,
      firstName: session.firstName,
      lastName: session.lastName,
      role: session.role,
      permissions: {}, // This would come from the backend
    };

    // In a real implementation, you would:
    // 1. Make an API call to your backend with the token
    // 2. Check if username/email already exists (if being updated)
    // 3. Hash the password if provided
    // 4. Update the user in the database
    // 5. Return the updated user data

    return NextResponse.json(updatedProfile);

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { statusCode: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 