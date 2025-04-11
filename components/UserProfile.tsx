// app/components/AuthButton.tsx
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function AuthButton() {
  const { data: session } = useSession()

  return (
    <div>
      {session ? (
        <>
          <p>Welcome, {session.user?.name}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button className=' cursor-pointer' onClick={() => signIn('google')}>Sign In with Google</button>
      )}
    </div>
  )
}
