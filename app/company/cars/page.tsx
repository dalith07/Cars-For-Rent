import { getCarItemsByCompany } from "@/actions/dashboard/cars";
import MyCarsPage from "@/components/pages/companies/all-cars";


export default async function page() {
    const carItems = await getCarItemsByCompany()
    return (
        <MyCarsPage carItems={carItems} />
    )
}
