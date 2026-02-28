import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStudent, updateStudent, deleteStudent } from '@/lib/database'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const student = await getStudent(parseInt(id), parseInt(session.user.id))

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('GET /api/students/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    // Verify student exists
    const student = await getStudent(parseInt(id), parseInt(session.user.id))
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    await updateStudent(parseInt(id), parseInt(session.user.id), data)
    return NextResponse.json({ id: parseInt(id), ...data })
  } catch (error) {
    console.error('PUT /api/students/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify student exists
    const student = await getStudent(parseInt(id), parseInt(session.user.id))
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    await deleteStudent(parseInt(id), parseInt(session.user.id))
    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/students/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}
