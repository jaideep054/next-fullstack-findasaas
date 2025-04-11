// app/api/auth/me/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User';
import { Env } from '@/lib/env'

export async function GET() {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    

    const decoded = jwt.verify(token, Env.JWT_SECRET) as { userId: string }

    const user = await User.findById(decoded.userId).select('-password')

    // console.log(user)

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
