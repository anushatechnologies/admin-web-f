import { useState } from "react";

type Row = {
  id: number;
  name: string;
  active: boolean;
  fixed: boolean;
  cost: number;
  vehicle: string;
};

const vehicles = [
  { id: 1, name: "Walk", icon: "🚶" },
  { id: 2, name: "Two Wheeler", icon: "🏍️" },
  { id: 3, name: "Four Wheeler", icon: "🚗" },
  { id: 4, name: "Heavy Vehicle", icon: "🚚" },
];

const PAGE_SIZE = 5;

export default function App() {
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [fixed, setFixed] = useState(false);
  const [cost, setCost] = useState<number | "">(""); // 🔥 no default 0
  const [vehicleId, setVehicleId] = useState<number | null>(null);

  const [rows, setRows] = useState<Row[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const reset = () => {
    setName("");
    setActive(true);
    setFixed(false);
    setCost("");
    setVehicleId(null);
    setEditId(null);
  };

  const save = () => {
    if (!name || !vehicleId) return alert("Name & Delivery Type required");

    const vehicle = vehicles.find(v => v.id === vehicleId)?.name || "";

    const costValue = cost === "" ? 0 : Number(cost);

    if (editId) {
      setRows(prev =>
        prev.map(r =>
          r.id === editId
            ? { ...r, name, active, fixed, cost: costValue, vehicle }
            : r
        )
      );
    } else {
      setRows(prev => [
        { id: Date.now(), name, active, fixed, cost: costValue, vehicle },
        ...prev
      ]);
    }

    reset();
    setShowNew(false);
  };

  const editRow = (r: Row) => {
    setShowNew(true);
    setName(r.name);
    setActive(r.active);
    setFixed(r.fixed);
    setCost(r.cost);
    setVehicleId(vehicles.find(v => v.name === r.vehicle)?.id || null);
    setEditId(r.id);
  };

  const delRow = (id: number) => {
    if (!confirm("Delete this record?")) return;
    setRows(prev => prev.filter(r => r.id !== id));
  };

  /* SEARCH */
  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-gray-50 p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Delevery Setup
        </h1>

        <div className="flex gap-4 items-center">
          <input
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Search delivery..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="relative">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              onClick={() => setShowMenu(prev => !prev)}
            >
              Menu
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg w-40">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100"
                  onClick={() => {
                    setShowNew(true);
                    setShowMenu(false);
                  }}
                >
                  ➕ New
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP FORM */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center pt-[10vh] z-50 overflow-auto">
          <div className="bg-white w-[750px] rounded-2xl shadow-2xl p-10 relative">

            <button
              onClick={() => setShowNew(false)}
              className="absolute top-5 right-6 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-8 border-b pb-4">
              {editId ? "Edit Delivery Charge" : "Add Delivery Charge"}
            </h2>

            <div className="grid grid-cols-2 gap-8">

              {/* NAME */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-2 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* ACTIVE */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Active
                </label>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => setActive(!active)}
                    className={`relative w-14 h-7 rounded-full ${
                      active ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full ${
                        active ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                  {active ? "Active" : "Inactive"}
                </div>
              </div>

              {/* FIXED */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Fixed
                </label>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => setFixed(!fixed)}
                    className={`relative w-14 h-7 rounded-full ${
                      fixed ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full ${
                        fixed ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                  {fixed ? "Yes" : "No"}
                </div>
              </div>

              {/* COST */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Fixed Delivery Cost
                </label>
                <input
                  type="number"
                  value={cost}
                  disabled={!fixed}
                  className={`mt-2 w-full border border-gray-300 px-4 py-2 rounded-lg ${
                    !fixed ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  onChange={e =>
                    setCost(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* DELIVERY TYPE */}
            <h3 className="mt-10 mb-5 text-lg font-semibold text-gray-700">
              Delivery Type
            </h3>

            <div className="grid grid-cols-4 gap-6">
              {vehicles.map(v => (
                <div
                  key={v.id}
                  onClick={() => setVehicleId(v.id)}
                  className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center gap-3 transition-all
                    ${vehicleId === v.id
                      ? "border-indigo-600 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:shadow-md hover:border-indigo-400"}`}
                >
                  <div className="text-4xl">{v.icon}</div>
                  <p className="font-medium text-gray-700">{v.name}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
              <button
                onClick={save}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg"
              >
                {editId ? "Update" : "Save"}
              </button>

              <button
                onClick={() => setShowNew(false)}
                className="border px-8 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Vehicle</th>
              <th className="px-6 py-4 text-left">Fixed</th>
              <th className="px-6 py-4 text-left">Cost</th>
              <th className="px-6 py-4 text-left">Active</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRows.map(r => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{r.name}</td>
                <td className="px-6 py-4">{r.vehicle}</td>
                <td className="px-6 py-4">{r.fixed ? "Yes" : "No"}</td>
                <td className="px-6 py-4">₹ {r.cost}</td>
                <td className="px-6 py-4">{r.active ? "Active" : "Inactive"}</td>
                <td className="px-6 py-4 space-x-4">
                  <button onClick={() => editRow(r)} className="text-indigo-600">
                    Edit
                  </button>
                  <button onClick={() => delRow(r.id)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!paginatedRows.length && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-indigo-600 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}