import { getAllCompanies } from "@/actions/dashboard/company/company";
import CompanyItemCars from "./company-item-cars";

const page = async () => {
    const result = await getAllCompanies();
    const companies = result.data ?? [];

    return (
        <div>
            <CompanyItemCars company={companies} />
        </div >
    )
}

export default page
