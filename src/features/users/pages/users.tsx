import { useState } from "react";

type User = {
    id: number;
    name: string;
    phone: string;
    wallet: number;
    active: boolean;
    createdAt: string;
    lastVisited: string;
};

const initialUsers: User[] = [
    {
        id: 1,
        name: "abhi",
        phone: "9849812345",
        wallet: 1500,
        active: true,
        createdAt: "2024-02-01",
        lastVisited: "2026-02-20",
    },
    {
        id: 2,
        name: "Ajay kumar",
        phone: "9550812345",
        wallet: 800,
        active: false,
        createdAt: "2024-01-15",
        lastVisited: "2026-02-18",
    },
    {
        id: 3,
        name: "kamal",
        phone: "8096712345",
        wallet: 1200,
        active: true,
        createdAt: "2024-01-10",
        lastVisited: "2026-02-15",
    },
    {
        id: 4,
        name: "koti",
        phone: "7075912345",
        wallet: 600,
        active: false,
        createdAt: "2024-01-05",
        lastVisited: "2026-02-12",
    },
];

export default function App() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [search, setSearch] = useState("");
    const [showPhone, setShowPhone] = useState<number | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [openLoginId, setOpenLoginId] = useState<number | null>(null);

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.phone.includes(search)
    );

    const maskPhone = (phone: string) =>
        `${phone.slice(0, 5)}****`;

    const deleteUser = (id: number) => {
        if (!confirm("Delete this user?")) return;
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setOpenMenuId(null);
        setOpenLoginId(null);
    };

    const updateStatus = (id: number, active: boolean) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id
                    ? {
                        ...u,
                        active,
                        lastVisited: new Date().toISOString().slice(0, 10),
                    }
                    : u
            )
        );
        setOpenMenuId(null);
        setOpenLoginId(null);
    };
    const downloadCSV = () => {
        const headers = [
            "ID",
            "Name",
            "Phone",
            "Wallet",
            "Status",
            "Created At",
            "Last Visited",
        ];

        const rows = filteredUsers.map((u) => [
            u.id,
            u.name,
            u.phone,
            u.wallet,
            u.active ? "Active" : "Inactive",
            u.createdAt,
            u.lastVisited,
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows]
                .map((e) => e.join(","))
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Users Management
                    </h2>

                    <div className="flex gap-3">
                        <input
                            placeholder="Search user..."
                            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            onClick={downloadCSV}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
                        >
                            Download User Data
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700">
                                <th className="p-3 text-left">Actions</th>
                                <th className="p-3 text-left">SN</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Wallet</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Created</th>
                                <th className="p-3 text-left">Last Visited</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.map((u, i) => (
                                <tr
                                    key={u.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    {/* Actions */}
                                    <td className="p-3 relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenuId(openMenuId === u.id ? null : u.id)
                                            }
                                            className="text-xl px-2 hover:bg-gray-200 rounded"
                                        >
                                            ⋮
                                        </button>

                                        {openMenuId === u.id && (
                                            <div className="absolute z-20 bg-white border rounded-lg shadow-md w-40 mt-2">
                                                <button
                                                    onClick={() =>
                                                        setOpenLoginId(openLoginId === u.id ? null : u.id)
                                                    }
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex justify-between"
                                                >
                                                    <span>Login</span>
                                                    <span>›</span>
                                                </button>

                                                {openLoginId === u.id && (
                                                    <div className="absolute left-full top-0 ml-1 bg-white border rounded-lg shadow-md w-40">
                                                        <button
                                                            onClick={() => updateStatus(u.id, true)}
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                                        >
                                                            Activate
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(u.id, false)}
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                                        >
                                                            Deactivate
                                                        </button>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => deleteUser(u.id)}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-3">{i + 1}</td>

                                    <td className="p-3">
                                        {u.name}
                                    </td>

                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            {showPhone === u.id ? u.phone : maskPhone(u.phone)}
                                            <button
                                                onClick={() =>
                                                    setShowPhone(showPhone === u.id ? null : u.id)
                                                }
                                                className="text-gray-500 hover:text-black"
                                            >
                                                👁
                                            </button>
                                        </div>
                                    </td>

                                    <td className="p-3 font-medium text-gray-800">
                                        ₹ {u.wallet}
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${u.active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {u.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="p-3 text-gray-600">{u.createdAt}</td>
                                    <td className="p-3 text-gray-600">{u.lastVisited}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}