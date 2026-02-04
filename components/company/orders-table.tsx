import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const orders = [
    {
        id: 1,
        customer: "Ahmed Ben Ali",
        car: "BMW X5",
        period: "10 Jan – 15 Jan",
        price: "$500",
        status: "Pending",
    },
]

const statusColor: Record<string, string> = {
    Pending: "bg-yellow-500",
    Accepted: "bg-green-500",
    Rejected: "bg-red-500",
    Completed: "bg-blue-500",
}

export function OrdersTable() {
    return (
        <div className="rounded-lg border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Car</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.car}</TableCell>
                            <TableCell>{order.period}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>
                                <Badge className={statusColor[order.status]}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="space-x-2">
                                {order.status === "Pending" && (
                                    <>
                                        <Button size="sm">Accept</Button>
                                        <Button size="sm" variant="destructive">
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
