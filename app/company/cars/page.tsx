import { getCarItemsByCompany } from "@/actions/dashboard/cars";
import MyCarsPage from "@/components/pages/companies/all-cars";

// Mark this route as dynamic since it uses auth() which requires headers()
export const dynamic = 'force-dynamic';

export default async function page() {
    const carItems = await getCarItemsByCompany()
    return (
        <MyCarsPage carItems={carItems} />
    )
}
