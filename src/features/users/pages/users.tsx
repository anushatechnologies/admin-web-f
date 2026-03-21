import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { 
    useGetCustomersQuery, 
    useUpdateCustomerStatusMutation, 
    useDeleteCustomerMutation 
} from "../../customers/api/customerApi";

export default function Users() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterActive, setFilterActive] = useState<string>("all");
    const [page, setPage] = useState(0);
    const [showPhone, setShowPhone] = useState<number | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const { data, isLoading, isFetching } = useGetCustomersQuery({
        search: debouncedSearch,
        active: filterActive === "all" ? undefined : filterActive,
        page,
        size: 15
    });

    const [updateStatus, { isLoading: isUpdating }] = useUpdateCustomerStatusMutation();
    const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

    const customers = data?.customers || [];
    const totalPages = data?.totalPages || 1;
    const totalElements = data?.totalElements || 0;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleStatusToggle = async (id: number, currentActive: boolean) => {
        try {
            await updateStatus({ id, active: !currentActive }).unwrap();
            toast.success("Status updated");
        } catch (err) {
            toast.error("Failed to update status");
        } finally {
            setOpenMenuId(null);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCustomer(id).unwrap();
            toast.success("Customer deleted successfully");
        } catch (err: any) {
            toast.error(`Deletion failed: ${err.data?.message || err.message}`);
        } finally {
            setOpenMenuId(null);
            setConfirmDeleteId(null);
        }
    };

    const downloadCSV = () => {
        const headers = ["ID", "Name", "Phone", "Email", "Status", "Created At", "Last Updated"];
        const rows = customers.map((c) => [
            c.id,
            c.name || "—",
            c.phoneNumber,
            c.email || "—",
            c.isActive ? "Active" : "Inactive",
            c.createdAt?.slice(0, 10) || "",
            c.updatedAt?.slice(0, 10) || "",
        ]);
        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((r) => r.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `customers_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const maskPhone = (phone: string) => `${phone.slice(0, 5)}****`;

    const formatDate = (iso: string) => iso?.slice(0, 10) || "—";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">

                {/* ── Header ── */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Users Management</h2>
                        <p className="text-sm text-gray-400 mt-0.5">{totalElements} customers total</p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        {/* Search */}
                        <input
                            placeholder="Search name or phone..."
                            className="bg-white text-gray-800 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-56"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        />

                        {/* Active filter */}
                        <select
                            className="bg-white text-gray-700 border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterActive}
                            onChange={(e) => { setFilterActive(e.target.value); setPage(0); }}
                        >
                            <option value="all">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                        {/* Download */}
                        <button
                            onClick={downloadCSV}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
                        >
                            ⬇ Download CSV
                        </button>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-left">
                                <th className="p-3 w-10">SN</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Created</th>
                                <th className="p-3">Last Updated</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-gray-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            {isFetching ? "Syncing..." : "Loading..."}
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-gray-400">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                customers.map((c, i) => (
                                    <tr
                                        key={c.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3 text-gray-500">{page * 15 + i + 1}</td>

                                        <td className="p-3 font-medium text-gray-800">
                                            {c.name || (
                                                <span className="text-gray-400 italic text-xs">Not set</span>
                                            )}
                                        </td>

                                        <td className="p-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono">
                                                    {showPhone === c.id ? c.phoneNumber : maskPhone(c.phoneNumber)}
                                                </span>
                                                <button
                                                    onClick={() => setShowPhone(showPhone === c.id ? null : c.id)}
                                                    className="text-gray-400 hover:text-gray-700 text-xs"
                                                    title={showPhone === c.id ? "Hide" : "Show"}
                                                >
                                                    {showPhone === c.id ? "🙈" : "👁"}
                                                </button>
                                            </div>
                                        </td>

                                        <td className="p-3 text-gray-500">
                                            {c.email || <span className="text-gray-300">—</span>}
                                        </td>

                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${c.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {c.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="p-3 text-gray-500">{formatDate(c.createdAt)}</td>
                                        <td className="p-3 text-gray-500">{formatDate(c.updatedAt)}</td>

                                        {/* Actions */}
                                        <td className="p-3 relative text-center">
                                            {(isUpdating || isDeleting) && openMenuId === c.id ? (
                                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            setOpenMenuId(openMenuId === c.id ? null : c.id)
                                                        }
                                                        className="text-xl px-2 hover:bg-gray-100 rounded transition"
                                                    >
                                                        ⋮
                                                    </button>

                                                    {openMenuId === c.id && (
                                                        <div className="absolute right-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-44 mt-1 py-1 text-left">
                                                            <button
                                                                onClick={() => handleStatusToggle(c.id, c.isActive)}
                                                                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-2"
                                                            >
                                                                {c.isActive ? (
                                                                    <>
                                                                        <span className="text-orange-500">⏸</span>
                                                                        Deactivate
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="text-green-600">▶</span>
                                                                        Activate
                                                                    </>
                                                                )}
                                                            </button>
                                                            <div className="border-t border-gray-100 my-1" />
                                                            <button
                                                                onClick={() => setConfirmDeleteId(c.id)}
                                                                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2"
                                                            >
                                                                <span>🗑</span> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-6">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                            ← Prev
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {page + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Close menu on outside click */}
            {openMenuId !== null && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpenMenuId(null)}
                />
            )}

            <ConfirmDialog
                open={confirmDeleteId !== null}
                title="Delete Customer"
                message="Are you sure you want to permanently delete this customer? This action cannot be undone."
                onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </div>
    );
}
