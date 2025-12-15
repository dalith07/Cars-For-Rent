// app/dashboard/admin/users/page.tsx
import UsersPage from "@/components/pages/users";
import { getAllUsers } from "@/data/user";

export default async function Users() {
    const users = await getAllUsers();
    // console.log("USERS:😍😍😍😍😍", users);

    return <UsersPage usersItems={users} />;
}