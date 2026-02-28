'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data?.user) {
          setIsLoggedIn(true)
        }
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Student Management
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Manage your students efficiently
        </p>

        {!isLoggedIn ? (
          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 block text-center"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 block text-center"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 block text-center"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/api/auth/signout"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 block text-center"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
