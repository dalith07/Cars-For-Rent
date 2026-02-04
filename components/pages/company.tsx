"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { EllipsisVertical, Eye, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CompanyWithAll } from "@/lib/utils";
import gsap from "gsap";
import { deleteCompany } from "@/actions/dashboard/company/company";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

interface CarItemsProps {
    company: CompanyWithAll[];
}

const CompanyPage = ({ company }: CarItemsProps) => {

    const [companies, setCompanies] = useState<CompanyWithAll[]>(company);
    const [openActionId, setOpenActionId] = useState<string | null>(null);

    const [selectedCompany, setSelectedCompany] = useState<CompanyWithAll | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const totalPages = Math.ceil(companies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedCompanies = companies.slice(startIndex, endIndex);

    // Animations
    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current.querySelectorAll(".table-row"),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 }
            );
        }
    }, [currentPage]);

    // Delete Company
    const handleDelete = async (id: string) => {
        await deleteCompany({ companyId: id });
        setCompanies(prev => prev.filter(c => c.id !== id));
        setOpenActionId(null);
    };

    // Verify Company
    const verifyCompany = (id: string) => {
        setCompanies(prev =>
            prev.map(c =>
                c.id === id ? { ...c, verified: true, role: "COMPANY_OWNER" } : c
            )
        );

        if (selectedCompany?.id === id) {
            setSelectedCompany({ ...selectedCompany, verified: true, role: "COMPANY_OWNER" });
        }
    };

    return (
        <div ref={containerRef} className="animate-fade-in flex bg-background p-6">

            <div className="flex-1">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Companies</h1>
                        <p className="text-muted-foreground">Manage registered companies</p>
                    </div>

                    <Link href="/create-company-account">
                        <Button size="lg" className="group">
                            <Plus className="group-hover:animate-ping" /> Add Company
                        </Button>
                    </Link>
                </div>

                <Card ref={tableRef} className="animate-scale-in">
                    <CardHeader>
                        <CardTitle>Company List</CardTitle>
                        <CardDescription>Total: {companies.length}</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-muted/50 border-b border-border">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Company Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Created</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedCompanies.length > 0 ? (
                                        paginatedCompanies.map((c) => (
                                            <tr key={c.id} className="table-row border-b hover:bg-muted/50 transition">
                                                {/* <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={c.logo || "/no-logo.png"}
                                                            className="w-10 h-10 rounded-full object-cover border"
                                                            alt="logo"
                                                        />
                                                        <span className="font-medium">{c.name}</span>
                                                    </div>
                                                </td> */}
                                                <td className="px-4 py-3 text-muted-foreground">{c.name}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{c.verified ? "yess" : "no"}</td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {c.createdAt ? new Date(c.createdAt).toISOString().split("T")[0] : "-"}
                                                </td>
                                                <td className="px-4 py-3 relative text-center">
                                                    <button
                                                        onClick={() => setOpenActionId(openActionId === c.id ? null : c.id)}
                                                        className="p-2 hover:bg-muted rounded"
                                                    >
                                                        <EllipsisVertical size={20} />
                                                    </button>

                                                    {openActionId === c.id && (
                                                        <div className="absolute right-20 -top-4 w-[150px] z-50 bg-background border rounded shadow animate-scale-in">

                                                            {/* View Modal Button */}
                                                            <button
                                                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm"
                                                                onClick={() => {
                                                                    setSelectedCompany(c);
                                                                    setShowDetails(true);
                                                                    setOpenActionId(null);
                                                                }}
                                                            >
                                                                <Eye size={16} /> View
                                                            </button>

                                                            {/* Delete */}
                                                            <button
                                                                onClick={() => handleDelete(c.id)}
                                                                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-500/20 text-sm"
                                                            >
                                                                <Trash2 size={16} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-muted-foreground">
                                                No companies found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {companies.length > 0 && (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to {Math.min(endIndex, companies.length)} of {companies.length}
                                </p>

                                <div className="flex items-center gap-2">

                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        <ChevronLeft />
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-8 h-8 rounded ${currentPage === i + 1 ? "bg-primary text-white" : "border"}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        <ChevronRight />
                                    </button>

                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ========= Modal View ======== */}
            {showDetails && selectedCompany && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background w-[500px] rounded-xl shadow-xl p-6 relative animate-scale-in">

                        <button onClick={() => setShowDetails(false)}
                            className="absolute right-4 top-3 text-sm hover:text-red-500">✖</button>

                        <h2 className="text-2xl font-bold mb-4">Company Details</h2>

                        <div className="flex items-center gap-4 mb-4">
                            <Image
                                src={selectedCompany.logo || ""}
                                alt="logo"
                                width={100}
                                height={100}
                                className="w-16 h-16 rounded-full object-cover border" />
                            <div>
                                <p className="text-xl font-semibold">{selectedCompany.name}</p>
                                <p className="text-muted-foreground">{selectedCompany.email}</p>
                            </div>
                        </div>

                        <p><b>ID:</b> {selectedCompany.id}</p>
                        <p><b>Created:</b> {new Date(selectedCompany.createdAt!).toISOString().split("T")[0]}</p>
                        <p><b>Role:</b> {selectedCompany.owner.role}</p>

                        <p className="mt-3">
                            <b>Status:</b>{" "}
                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                ${selectedCompany.verified ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"}`}>
                                {selectedCompany.verified ? "Verified" : "Not Verified"}
                            </span>
                        </p>

                        <p className="mt-3">
                            <b>Cars in stock:</b> {selectedCompany.cars?.length || 0}
                        </p>

                        {!selectedCompany.verified && (
                            <Button
                                className="w-full mt-4 bg-green-600 text-white"
                                onClick={() => verifyCompany(selectedCompany.id)}
                            >
                                Verify Company → Become COMPANY_OWNER
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyPage;
