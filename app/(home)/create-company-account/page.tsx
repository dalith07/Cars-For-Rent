import { getUserCompany } from "@/actions/dashboard/company/company";
import CreateCompanyAccount from "./create-company-account";

const Page = async () => {
    // const company = await getCompany();
    const userCompany = await getUserCompany();

    console.log(userCompany?.status)

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