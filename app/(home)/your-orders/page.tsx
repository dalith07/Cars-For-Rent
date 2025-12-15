import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserOrders } from "@/actions/cart";
import { DeleteOrderButton } from "./DeleteOrderButton";
import ConfettiClient from "./ConfettiClient";

export default async function YourOrders() {
    const orders = await getUserOrders();

    return (
        <>
            <ConfettiClient />

            <div className="min-h-screen px-4 mt-32 container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10">
                    <span className="text-white">Your </span>
                    <span className="text-green-500">Orders</span>
                </h1>

                <Card className="bg-[#080a13] border-gray-800 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">
                            Orders
                            <span className="text-gray-400 text-sm block my-2">Total: {orders.length}</span>
                            <p className="text-sm text-green-500 opacity-80">{"We'll"} call you very soon to confirm your orders!</p>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="overflow-x-auto">
                        {orders.length === 0 ? (
                            <p className="text-gray-400 text-center py-6">
                                You don’t have any orders yet.
                            </p>
                        ) : (
                            <table className="w-full text-sm text-gray-300 border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 text-left">
                                        <th className="px-4 py-2 border-b border-gray-700">Order Date</th>
                                        <th className="px-4 py-2 border-b border-gray-700">Order Status</th>
                                        <th className="px-4 py-2 border-b border-gray-700">Is Order Paid</th>
                                        <th className="px-4 py-2 border-b border-gray-700">Client</th>
                                        <th className="px-4 py-2 border-b border-gray-700">Phone</th>
                                        <th className="px-4 py-2 border-b border-gray-700">Address</th>
                                        <th className="px-4 py-2 border-b border-gray-700">Amount</th>
                                        <th className="px-4 py-2 border-b border-gray-700 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-800">
                                            <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                                            <td className="px-4 py-2">
                                                <Badge
                                                    className={
                                                        `text-white ${order.status === "processing" && "animate-pulse"} ${order.status === "processing"
                                                            ? "bg-blue-600"
                                                            : order.status === "confirmed"
                                                                ? "bg-green-600"
                                                                : "bg-red-600"}`
                                                    }
                                                >
                                                    {order.status || "Processing"}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Badge
                                                    className={`text-white ${order.isPaid === "Paid" ? "bg-green-600" : "bg-red-600"
                                                        }`}
                                                >
                                                    {order.isPaid}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2">{order.customerName}</td>
                                            <td className="px-4 py-2">{order.phoneNumber}</td>
                                            <td className="px-4 py-2">{order.shippingAddress}</td>
                                            <td className="px-4 py-2 font-bold text-white">{(order.total ?? 0)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "} TND</td>
                                            <td className="px-4 py-2 text-right relative group">
                                                <DeleteOrderButton orderId={order.id} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
