// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  // const token = cookieStore.get('token')?.value

  cookieStore.set({
    name: 'token',
    value: '',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0, 
  })

  return NextResponse.json({ message: 'Logged out successfully' })
}
