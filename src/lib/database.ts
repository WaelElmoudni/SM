import fs from 'fs'
import path from 'path'
import initSqlJs from 'sql.js'

const dbPath = path.join(process.cwd(), 'students.db')

let db: any = null
let SQL: any = null

async function initSQL() {
  if (!SQL) {
    SQL = await initSqlJs()
  }
  return SQL
}

async function getDb() {
  if (!db) {
    const SQL = await initSQL()

    try {
      if (fs.existsSync(dbPath)) {
        const filebuffer = fs.readFileSync(dbPath)
        db = new SQL.Database(filebuffer)
      } else {
        db = new SQL.Database()
        initializeDb()
      }
    } catch (error) {
      console.error('Database initialization error:', error)
      db = new SQL.Database()
      initializeDb()
    }
  }
  return db
}

function saveDb() {
  if (db) {
    try {
      const data = db.export()
      const buffer = Buffer.from(data)
      fs.writeFileSync(dbPath, buffer)
    } catch (error) {
      console.error('Error saving database:', error)
    }
  }
}

function initializeDb() {
  if (!db) return

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      enrollmentNumber TEXT UNIQUE NOT NULL,
      department TEXT,
      semester INTEGER,
      gpa REAL,
      status TEXT DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `)
  saveDb()
}

export async function getStudents(userId: number) {
  const database = await getDb()
  const stmt = database.prepare('SELECT * FROM students WHERE userId = ? ORDER BY createdAt DESC')
  stmt.bind([userId])
  const results: any[] = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()
  return results
}

export async function getStudent(id: number, userId: number) {
  const database = await getDb()
  const stmt = database.prepare('SELECT * FROM students WHERE id = ? AND userId = ?')
  stmt.bind([id, userId])
  let result = null
  if (stmt.step()) {
    result = stmt.getAsObject()
  }
  stmt.free()
  return result
}

export async function createStudent(userId: number, data: any) {
  const database = await getDb()
  const stmt = database.prepare(`
    INSERT INTO students (userId, firstName, lastName, email, phone, enrollmentNumber, department, semester, gpa, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.bind([
    userId,
    data.firstName,
    data.lastName,
    data.email,
    data.phone || null,
    data.enrollmentNumber,
    data.department || null,
    data.semester || 1,
    data.gpa || 0,
    'active'
  ])

  stmt.step()
  stmt.free()
  saveDb()

  const idStmt = database.prepare('SELECT last_insert_rowid() as id')
  idStmt.step()
  const result = idStmt.getAsObject()
  idStmt.free()
  return result.id
}

export async function updateStudent(id: number, userId: number, data: any) {
  const database = await getDb()
  const stmt = database.prepare(`
    UPDATE students
    SET firstName = ?, lastName = ?, email = ?, phone = ?, department = ?, semester = ?, gpa = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ? AND userId = ?
  `)

  stmt.bind([
    data.firstName,
    data.lastName,
    data.email,
    data.phone || null,
    data.department || null,
    data.semester || 1,
    data.gpa || 0,
    data.status || 'active',
    id,
    userId
  ])

  stmt.step()
  stmt.free()
  saveDb()
}

export async function deleteStudent(id: number, userId: number) {
  const database = await getDb()
  const stmt = database.prepare('DELETE FROM students WHERE id = ? AND userId = ?')
  stmt.bind([id, userId])
  stmt.step()
  stmt.free()
  saveDb()
}

export async function getUserByEmail(email: string) {
  const database = await getDb()
  const stmt = database.prepare('SELECT * FROM users WHERE email = ?')
  stmt.bind([email])
  let result = null
  if (stmt.step()) {
    result = stmt.getAsObject()
  }
  stmt.free()
  return result
}

export async function createUser(email: string, password: string, name: string) {
  const database = await getDb()
  const stmt = database.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)')
  stmt.bind([email, password, name])
  stmt.step()
  stmt.free()
  saveDb()

  const idStmt = database.prepare('SELECT last_insert_rowid() as id')
  idStmt.step()
  const result = idStmt.getAsObject()
  idStmt.free()
  return result.id
}

export function closeDb() {
  if (db) {
    saveDb()
    db.close()
    db = null
  }
}
