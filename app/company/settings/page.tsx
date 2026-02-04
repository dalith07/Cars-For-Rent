import { getCompanyWithDetails } from "@/actions/company/settings";
import { auth } from "@/auth";
import SettingsPage from "@/components/company/settings-client";

export default async function Page() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const company = await getCompanyWithDetails(session.user.id);
    if (!company) return null;

    return <SettingsPage company={company} />;
}