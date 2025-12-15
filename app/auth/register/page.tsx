import RegisterForm from '@/components/auth/register-form'

const page = () => {
    return (
        <div className="min-h-screen  flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0">
                <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
                <div className="absolute w-80 h-80 bg-purple-600/20 rounded-full blur-3xl bottom-10 right-10 animate-ping"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm m-4 sm:m-0">
                <RegisterForm />
            </div>
        </div>
    )
}

export default page
