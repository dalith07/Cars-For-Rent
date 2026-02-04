import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Button } from '../ui/button'

const ErrorCard = () => {
    return (
        <div className="w-full bg-black h-screen flex flex-col justify-center items-center text-center gap-4">
            <ExclamationTriangleIcon className="text-destructive w-12 h-12 animate-pulse" />
            <h1 className="text-2xl font-bold text-white">Oops! Something went wrong!</h1>
            <Link
                href="/auth/login"
            >
                <Button className='hover:cursor-pointer'>
                    Back to login
                </Button>
            </Link>
        </div>
    )
}

export default ErrorCard
