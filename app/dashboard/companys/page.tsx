import { getCompany } from "@/actions/dashboard/company/company"
import CompanyPage from "@/components/pages/company"

const page = async () => {
    const company = await getCompany()

    return (
        <div>
            <CompanyPage company={company} />
        </div>
    )
}

export default page
