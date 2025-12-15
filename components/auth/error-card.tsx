import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'


const ErrorCard = () => {
    return (
        <div className='w-full flex justify-center items-center'>
            <h1>Oops! Something went wrong!</h1>
            <ExclamationTriangleIcon className='text-destructive' />

            <Link href={"/auth/login"}>Back to login</Link>
        </div>
    )
}

export default ErrorCard
