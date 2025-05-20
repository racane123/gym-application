'use client'

import { signOut } from 'next-auth/react'


export default function Button (){
    return (
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >


        </button>
    )
}