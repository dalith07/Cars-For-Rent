import { getCompanyOrders } from "@/actions/company/order"
import OrdersClientPage from "@/components/pages/companies/order-client-page"

export default async function OrdersPage() {
    const orders = await getCompanyOrders()
    return (
        <OrdersClientPage orders={orders} />
    )
}
