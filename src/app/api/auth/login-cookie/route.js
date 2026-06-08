import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-local-dev';

export async function POST(request) {
  try {
    const { token } = await request.json();
    
    // We already verified credentials via Supabase in the frontend (AuthContext.js)
    // This endpoint is purely to set the HTTP-Only cookie so Next.js middleware knows the user is logged in
    
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    const jwtToken = await new SignJWT({ authorized: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // Valid for 24 hours
      .sign(secret);

    const response = NextResponse.json({ success: true });
    
    // Set HTTP-Only Cookie
    response.cookies.set({
      name: 'admin_token',
      value: jwtToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
