import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail, createUser } from '@/lib/users-db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validate inputs
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userId = await createUser(email, hashedPassword, name)

    return NextResponse.json(
      { id: userId, email, name },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : '',
      env: process.env.NODE_ENV
    })
    return NextResponse.json(
      { error: 'Failed to register', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
