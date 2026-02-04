import { getAllCompanies, } from '@/actions/dashboard/company/company'
import CompaniesContent from '@/components/pages/companies/companies-content'

const Page = async () => {
    // const companies = await getCompany()

    const companies = await getAllCompanies()

    if (!companies.success) {
        return <div>Error loading companies</div>;
    }
    return (
        <div>
            <CompaniesContent company={companies.data} />
        </div>
    )
}

export default Page
