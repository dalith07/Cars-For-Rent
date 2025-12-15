import { getCarItems } from "@/actions/dashboard/cars"
import CarsPage from "@/components/pages/cars"

const page = async () => {

    const carItems = await getCarItems()

    return (
        <div>
            <CarsPage carItems={carItems} />
        </div>
    )
}

export default page
