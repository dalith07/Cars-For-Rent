"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteCompanyById } from "@/actions/dashboard/company/company"

interface CompanyActionsProps {
    companyId: string
    companyName: string
}

export function CompanyActions({ companyId, companyName }: CompanyActionsProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        startTransition(async () => {
            await deleteCompanyById(companyId)
            setOpen(false)
        })
    }

    return (
        <>
            {/* Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:cursor-pointer bg-slate-700 text-white rounded-full
                       opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-36 bg-slate-800 border-none shadow-lg"
                >
                    <DropdownMenuItem
                        className="flex items-center gap-2 text-white hover:bg-slate-700 cursor-pointer"
                        onClick={() => router.push(`/admin/companies/${companyId}`)}
                    >
                        <Eye className="h-4 w-4 text-primary" />
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="flex items-center gap-2 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Remove
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Alert Dialog */}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="bg-slate-900 border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Remove company?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to remove{" "}
                            <span className="font-semibold text-white">
                                {companyName}
                            </span>
                            ?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 hover:cursor-pointer hover:text-white text-white hover:bg-slate-600">
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isPending}
                            className="bg-rose-600 hover:cursor-pointer hover:bg-rose-700 text-white"
                        >
                            {isPending ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
