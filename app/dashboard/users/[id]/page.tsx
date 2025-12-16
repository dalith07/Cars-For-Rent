import { getUserById } from "@/data/user";
import ProfileUser from "./profile-user";
import { UserWithProfile } from "@/lib/utils";

interface PageProps {
    params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {

    const id = (await params).id;
    const userOrNull = await getUserById(id);

    if (!userOrNull) {
        return <div className="text-center">User not found</div>;
    }

    const user: UserWithProfile = userOrNull; // TS now knows this is non-null
    return <ProfileUser user={user} />;
}

export default page


