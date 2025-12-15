import { getUsersOrders } from "@/actions/dashboard/orders";
import OrdersPage from "@/components/pages/orders"

const page = async () => {

    const orders = await getUsersOrders();
    return (
        <div>
            <OrdersPage ordersItems={orders} />
        </div>
    )
}

export default page
