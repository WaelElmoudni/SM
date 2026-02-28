# Student Management Application

A complete full-stack student management application built with Next.js, featuring authentication, CRUD operations, and a responsive user interface.

## Features

- **User Authentication**: Account registration and login with NextAuth
- **Student Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Responsive Dashboard**: View and manage all students
- **Database**: SQLite for data persistence
- **Security**: Password hashing with bcryptjs
- **API**: RESTful API endpoints for student management

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: SQLite with better-sqlite3
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/     # NextAuth handler
│   │   │   │   ├── register/          # User registration endpoint
│   │   │   │   └── session            # Session endpoint
│   │   │   └── students/
│   │   │       ├── route.ts           # GET (list) and POST (create)
│   │   │       └── [id]/
│   │   │           └── route.ts       # GET, PUT, DELETE individual student
│   │   ├── dashboard/
│   │   │   ├── page.tsx               # Main dashboard
│   │   │   ├── add-student/           # Add new student
│   │   │   └── edit-student/[id]/     # Edit student
│   │   ├── login/
│   │   ├── register/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Home page
│   │   └── globals.css
│   ├── lib/
│   │   ├── auth.ts                    # NextAuth configuration
│   │   └── database.ts                # Database operations
│   └── components/                     # Reusable components (future)
├── public/                             # Static files
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/WaelElmoudni/SM.git
   cd SM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/callback/credentials` - Login
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Logout

### Students

- `GET /api/students` - List all students
- `POST /api/students` - Create a new student
- `GET /api/students/[id]` - Get a specific student
- `PUT /api/students/[id]` - Update a student
- `DELETE /api/students/[id]` - Delete a student

## Usage

### Register a User
1. Navigate to `/register`
2. Fill in the registration form
3. Click "Register"

### Login
1. Navigate to `/login`
2. Enter your credentials
3. Click "Login"

### Manage Students
1. After login, you'll be on the Dashboard
2. Click "Add Student" to create a new student
3. View all students in the table
4. Click "Edit" to modify a student
5. Click "Delete" to remove a student

## Building for Production

```bash
npm run build
npm start
```

## Testing

All APIs are tested and working correctly:
- User registration validates email uniqueness and password requirements
- User login authenticates credentials
- Student CRUD operations validate permissions and data integrity
- All endpoints return appropriate HTTP status codes

## Deployment to Vercel

The application is configured for deployment on Vercel:

1. Push code to GitHub
2. Connect GitHub repository to Vercel
3. Vercel will automatically deploy on each push

### Environment Variables

Create `.env.local` file with:
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## License

MIT

## Author

Wael Elmoudni (w.elmoudni@esisa.ac.ma)

## Support

For issues and questions, please email: w.elmoudni@esisa.ac.ma
