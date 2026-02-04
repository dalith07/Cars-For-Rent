import { getUserCompany } from "@/actions/dashboard/company/company";
import CreateCompanyAccount from "./create-company-account";

// ✅ لازمها تكون فوق أي logic
export const dynamic = "force-dynamic";

const Page = async () => {
    const userCompany = await getUserCompany();

    return (
        <div>
            <CreateCompanyAccount
                userCompany={
                    ["PENDING", "APPROVED", "REJECTED"].includes(userCompany?.status ?? "")
                        ? userCompany
                        : null
                }
            />
        </div>
    );
};

export default Page;
