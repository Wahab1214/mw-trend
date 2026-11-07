import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MASTER_OWNER_EMAIL = 'wmofficial11@gmail.com';
const ALLOWED_ADMIN_EMAILS = [
  'wmofficial11@gmail.com',
  'owner@mwtrends.pk',
  'admin@mwtrends.pk',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, action } = body;

    // Handle Logout
    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
      response.cookies.delete('mw_admin_session');
      response.cookies.set('mw_admin_session', '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
      return response;
    }

    // Handle Login
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return NextResponse.json(
        { success: false, error: 'Please enter both email and password.' },
        { status: 400 }
      );
    }

    // Check authorization: Owner or Allowed email
    const isOwner = cleanEmail === MASTER_OWNER_EMAIL;
    const isAllowed = ALLOWED_ADMIN_EMAILS.includes(cleanEmail);

    if (!isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Access Denied: "${cleanEmail}" is not authorized. Only the verified store owner (${MASTER_OWNER_EMAIL}) and authorized team members can access Admin Studio.`,
        },
        { status: 403 }
      );
    }

    // Password validation (min 6 characters or master pass)
    const isCorrectPass = cleanPass === 'MWTrends@2026' || cleanPass.length >= 6;
    if (!isCorrectPass) {
      return NextResponse.json(
        { success: false, error: 'Invalid password. Password must be at least 6 characters.' },
        { status: 401 }
      );
    }

    const staffName = isOwner ? 'Wahab (Owner)' : 'Store Owner';
    const userPayload = {
      id: isOwner ? 'usr_owner_master' : 'usr_staff_' + Date.now(),
      email: cleanEmail,
      name: staffName,
      role: 'owner' as const,
    };

    const response = NextResponse.json({
      success: true,
      user: userPayload,
      message: 'Authentication successful',
    });

    // Set secure in-memory session cookie (no maxAge = expires on session end)
    response.cookies.set('mw_admin_session', encodeURIComponent(JSON.stringify(userPayload)), {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Accessible by both middleware and client if needed
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
