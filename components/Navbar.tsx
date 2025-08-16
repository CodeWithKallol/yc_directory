import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { auth, signOut, signIn} from '@/auth'
import { BadgePlus, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import { signOut } from 'next-auth/react'

const Navbar = async () => {
  const session = await auth();

  return (
    <header className='px-5 py-3 bg-white shadow-sm font-work-sans'>
      <nav className='flex justify-between items-center'>
        <Link href="/">
          <Image src="/logo.png" width={144} height={30} alt="logo"/>
        </Link>

        <div className='flex gap-5 items-center text-black cursor-pointer'>
            {session && session?.user ? (
              <>
                <Link href="/startup/create">
                  <span className="max-sm:hidden hover:text-blue-500">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
                </Link>

                <form action={
                  async ()=>{
                    "use server";

                    await signOut({redirectTo: '/'})
                  }
                }>
                  <button type='submit' className='hover:text-red-500'>
                    <span className="max-sm:hidden">Logout</span>
                  <LogOut className="size-6 sm:hidden text-red-500" />
                  </button>
                </form>

                <Link href={`/user/${session?.id}`}>
                    <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>{session?.user?.image || ""}</AvatarFallback>
                </Avatar>
                </Link>
              </>
            ):(
              <form action={async ()=>{
                "use server";
                await signIn('github')
                }}>
                  
                  <button type='submit' className='hover:text-orange-500'>Login</button>

                </form>

            )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar