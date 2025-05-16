import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value;

  // ✅ Jika belum login, redirect ke halaman login
  if (!userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ✅ Kalau sudah login, lanjut ke halaman yang diminta
  return NextResponse.next();
}
