import { getUserById } from "@/data/user";
import ProfileUser from "./profile-user";

interface PageProps {
    params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {

    const user = await getUserById((await params).id);
    // console.log(user)
    return (
        <ProfileUser user={user} />
    )
}

export default page


