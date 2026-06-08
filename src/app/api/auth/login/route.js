import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-local-dev';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin@jdmusicent'
};

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const secret = new TextEncoder().encode(JWT_SECRET);
      
      const user = {
        id: 'user_admin_001',
        name: 'Super Admin',
        role: 'superadmin',
        username: 'admin'
      };

      const token = await new SignJWT(user)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // Valid for 24 hours
        .sign(secret);

      const response = NextResponse.json({ success: true, user });
      
      // Set HTTP-Only Cookie
      response.cookies.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Username atau password salah' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
