import fs from 'fs'
import path from 'path'

const usersDbPath = path.join(process.cwd(), 'users.json')

interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

function ensureDbExists() {
  try {
    if (!fs.existsSync(usersDbPath)) {
      fs.writeFileSync(usersDbPath, JSON.stringify({ users: [] }, null, 2))
    }
  } catch (error) {
    console.warn('Could not create users database file (expected on Vercel)')
  }
}

function readUsers(): User[] {
  try {
    ensureDbExists()
    const data = fs.readFileSync(usersDbPath, 'utf-8')
    const parsed = JSON.parse(data)
    return parsed.users || []
  } catch (error) {
    console.warn('Error reading users database:', error)
    return []
  }
}

function writeUsers(users: User[]) {
  try {
    fs.writeFileSync(usersDbPath, JSON.stringify({ users }, null, 2))
  } catch (error) {
    console.warn('Error writing users database (expected on Vercel):', error)
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = readUsers()
  return users.find(u => u.email === email) || null
}

export async function createUser(email: string, password: string, name: string): Promise<string> {
  const users = readUsers()
  
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password,
    name,
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  writeUsers(users)
  
  return newUser.id
}

export async function getStudents(userId: string) {
  // Placeholder for student retrieval
  return []
}

export async function getStudent(id: string, userId: string) {
  return null
}

export async function createStudent(userId: string, data: any) {
  return null
}

export async function updateStudent(id: string, userId: string, data: any) {
  // Update logic
}

export async function deleteStudent(id: string, userId: string) {
  // Delete logic
}

export function closeDb() {
  // No cleanup needed for JSON
}
