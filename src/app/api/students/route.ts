import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStudents, createStudent } from '@/lib/database'

export async function GET(_request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const students = await getStudents(parseInt(session.user.id))
    return NextResponse.json(students)
  } catch (error) {
    console.error('GET /api/students error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.enrollmentNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const studentId = await createStudent(parseInt(session.user.id), data)
    return NextResponse.json(
      { id: studentId, ...data },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/students error:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
