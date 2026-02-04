import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserOrders } from "@/actions/cart";
import { DeleteOrderButton } from "./DeleteOrderButton";
import ConfettiClient from "./ConfettiClient";
import { RentalStatus } from "@prisma/client";

export default async function YourOrders() {
    const orders = await getUserOrders();

    // ✅ Total متاع جميع Orders
    const grandTotal = orders.reduce(
        (sum, order) => sum + (order.totalPrice ?? 0),
        0
    );


    const formatPaymentStatus = (status: string) => {
        switch (status) {
            case "PAID":
                return "PAID";
            case "NOT_PAID":
                return "NOT PAID";
            default:
                return status;
        }
    };

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
                            <span className="text-gray-400 text-sm block my-2">
                                Total: {orders.length}
                            </span>
                            <p className="text-sm text-green-500 opacity-80">
                                {"We'll"} call you very soon to confirm your orders!
                            </p>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="overflow-x-auto">
                        {orders.length === 0 ? (
                            <p className="text-gray-400 text-center py-6">
                                You don’t have any orders yet.
                            </p>
                        ) : (
                            <>
                                <table className="w-full text-sm text-gray-300 border-collapse">
                                    <thead>
                                        <tr className="bg-gray-900 text-left">
                                            <th className="px-4 py-2 border-b border-gray-700">
                                                Order Number
                                            </th>
                                            <th className="px-4 py-2 border-b border-gray-700">
                                                Order Date
                                            </th>
                                            <th className="px-4 py-2 border-b border-gray-700">
                                                Order Status
                                            </th>
                                            <th className="px-4 py-2 border-b border-gray-700">
                                                Is Order Paid
                                            </th>

                                            {/* Hidden on mobile */}
                                            <th className="px-4 py-2 border-b border-gray-700 hidden md:table-cell">
                                                Client
                                            </th>
                                            <th className="px-4 py-2 border-b border-gray-700 hidden md:table-cell">
                                                Phone
                                            </th>
                                            <th className="px-4 py-2 border-b border-gray-700 hidden md:table-cell">
                                                Address
                                            </th>

                                            <th className="px-4 py-2 border-b border-gray-700">
                                                Amount
                                            </th>
                                            <th className="px-4 py-2 border-b border-gray-700">
                                                Company
                                            </th>
                                            <th className="px-4 py-2 border-b border-gray-700 text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-800">
                                                <td className="px-4 py-2 text-[0.6rem] md:text-[0.9rem]">{order.orderNumber}</td>
                                                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>

                                                <td className="px-4 py-2">
                                                    <Badge
                                                        className={`text-white ${order.status === RentalStatus.PENDING
                                                            ? "bg-primary/80 animate-pulse"
                                                            : order.status === RentalStatus.ACCEPTED
                                                                ? "bg-blue-600"
                                                                : order.status === RentalStatus.COMPLETED
                                                                    ? "bg-emerald-600"
                                                                    : order.status === RentalStatus.CANCELLED
                                                                        ? "bg-red-600"
                                                                        : "bg-gray-600"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </td>

                                                <td className="px-4 py-2">
                                                    <Badge
                                                        className={`text-white ${order.paymentStatus === "PAID" ? "bg-green-600" : "bg-red-600"
                                                            }`}
                                                    >
                                                        {formatPaymentStatus(order.paymentStatus)}
                                                    </Badge>
                                                </td>

                                                {/* Hidden on mobile */}
                                                <td className="px-4 py-2 hidden md:table-cell">{order.user?.name ?? "N/A"}</td>
                                                <td className="px-4 py-2 hidden md:table-cell">{order.user?.profile?.phoneNumber ?? "N/A"}</td>
                                                <td className="px-4 py-2 hidden md:table-cell">{order.user?.profile?.streetAddress ?? "N/A"}</td>

                                                <td className="px-4 py-2 font-bold text-white">{(order.totalPrice ?? 0).toLocaleString()} TND</td>
                                                <td className="px-4 py-2 font-bold text-white">{order.company.name.toUpperCase()}</td>
                                                <td className="px-4 py-2 text-right relative group">
                                                    <DeleteOrderButton orderId={order.id} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* ✅ TOTAL متاع جميع Orders (من اللوطة) */}
                                <div className="flex justify-end mt-6">
                                    <div className="bg-gray-900 border border-gray-700 rounded-lg px-6 py-4">
                                        <p className="text-gray-400 text-sm">
                                            Total Orders Amount
                                        </p>
                                        <p className="text-2xl font-bold text-green-500">
                                            {grandTotal
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                            TND
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
