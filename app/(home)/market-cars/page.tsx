import { getCarItems } from "@/actions/dashboard/cars";
import ItemsCarsClient from "./ItemsCars"

const MarketPlace = async () => {
    const cars = await getCarItems();

    return (
        <div>
            <ItemsCarsClient cars={cars} />
        </div>
    )
}

export default MarketPlace
