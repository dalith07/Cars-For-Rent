import { getCarItems } from "@/actions/dashboard/cars";
import ItemsCarsClient from "./ItemsCars"

const MarketPlace = async () => {
    const cars = await getCarItems();

    // Debug logging to check data structure
    // console.log("🚗 Total cars fetched:", cars.length);

    // if (cars.length > 0) {
    //     const firstCar = cars[0];
    //     console.log("🔍 First car name:", firstCar.name);
    //     console.log("🖼️ First car images array:", firstCar.imagesOnCars);
    //     console.log("🖼️ First car images length:", firstCar.imagesOnCars?.length ?? 0);

    //     const firstImageUrl = firstCar?.imagesOnCars?.[0]?.imageUrl;
    //     console.log(
    //         "Image Car👍❤️❤️:",
    //         firstImageUrl ?? "No image found"
    //     );

    //     if (firstImageUrl) {
    //         console.log("✅ Image URL is valid:", firstImageUrl);
    //     } else {
    //         console.warn("⚠️ No image URL found in first car");
    //     }
    // } else {
    //     console.log("⚠️ No cars found in database");
    // }

    return (
        <div>
            <ItemsCarsClient cars={cars} />
        </div>
    )
}

export default MarketPlace
