import { useState } from 'react';
import toast from 'react-hot-toast';

type Row = {
  id: number;
  name: string;
  active: boolean;
  fixed: boolean;
  cost: number;
  vehicle: string;
};

const vehicles = [
  { id: 1, name: 'Walk', icon: '🚶' },
  { id: 2, name: 'Two Wheeler', icon: '🏍️' },
  { id: 3, name: 'Four Wheeler', icon: '🚗' },
  { id: 4, name: 'Heavy Vehicle', icon: '🚚' },
];

const PAGE_SIZE = 5;

export default function App() {
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [fixed, setFixed] = useState(false);
  const [cost, setCost] = useState<number | ''>(''); // 🔥 no default 0
  const [vehicleId, setVehicleId] = useState<number | null>(null);

  const [rows, setRows] = useState<Row[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const reset = () => {
    setName('');
    setActive(true);
    setFixed(false);
    setCost('');
    setVehicleId(null);
    setEditId(null);
  };

  const save = () => {
    if (!name || !vehicleId) {
      toast.error('Name & Delivery Type required');
      return;
    }

    const vehicle = vehicles.find((v) => v.id === vehicleId)?.name || '';

    const costValue = cost === '' ? 0 : Number(cost);

    if (editId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editId ? { ...r, name, active, fixed, cost: costValue, vehicle } : r,
        ),
      );
    } else {
      setRows((prev) => [
        { id: Date.now(), name, active, fixed, cost: costValue, vehicle },
        ...prev,
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
    setVehicleId(vehicles.find((v) => v.name === r.vehicle)?.id || null);
    setEditId(r.id);
  };

  const delRow = (id: number) => {
    if (!confirm('Delete this record?')) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  /* SEARCH */
  const filtered = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div
      className="min-h-screen p-10"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
          Delivery Setup
        </h1>

        <div className="flex gap-4 items-center">
          <input
            className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-soft)',
            }}
            placeholder="Search delivery..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="relative">
            <button
              className="px-6 py-2 rounded-lg transition hover:opacity-90 shadow-sm text-white"
              style={{ backgroundColor: 'var(--highlight-color)' }}
              onClick={() => setShowMenu((prev) => !prev)}
            >
              Menu
            </button>

            {showMenu && (
              <div
                className="absolute right-0 mt-2 shadow-xl rounded-lg w-40 overflow-hidden border"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-soft)' }}
              >
                <button
                  className="w-full text-left px-4 py-3 transition"
                  style={{ color: 'var(--text-color)' }}
                  onClick={() => {
                    setShowNew(true);
                    setShowMenu(false);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--border-soft)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
          <div
            className="w-[750px] rounded-2xl shadow-2xl p-10 relative border h-fit"
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-soft)',
            }}
          >
            <button
              onClick={() => setShowNew(false)}
              className="absolute top-5 right-6 text-xl transition hover:opacity-75"
              style={{ color: 'var(--text-color)' }}
            >
              ✕
            </button>

            <h2
              className="text-2xl font-semibold mb-8 border-b pb-4"
              style={{ borderColor: 'var(--border-soft)' }}
            >
              {editId ? 'Edit Delivery Charge' : 'Add Delivery Charge'}
            </h2>

            <div className="grid grid-cols-2 gap-8">
              {/* NAME */}
              <div>
                <label className="text-sm font-semibold opacity-80">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-color)',
                    borderColor: 'var(--border-soft)',
                  }}
                />
              </div>

              {/* ACTIVE */}
              <div>
                <label className="text-sm font-semibold opacity-80">Active</label>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => setActive(!active)}
                    className={`relative w-14 h-7 rounded-full transition-colors`}
                    style={{
                      backgroundColor: active ? 'var(--highlight-color)' : 'var(--border-soft)',
                    }}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full ${
                        active ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                  {active ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* FIXED */}
              <div>
                <label className="text-sm font-semibold opacity-80">Fixed</label>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => setFixed(!fixed)}
                    className={`relative w-14 h-7 rounded-full transition-colors`}
                    style={{
                      backgroundColor: fixed ? 'var(--highlight-color)' : 'var(--border-soft)',
                    }}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                        fixed ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                  {fixed ? 'Yes' : 'No'}
                </div>
              </div>

              {/* COST */}
              <div>
                <label className="text-sm font-semibold opacity-80">Fixed Delivery Cost</label>
                <input
                  type="number"
                  value={cost}
                  disabled={!fixed}
                  className={`mt-2 w-full border px-4 py-2 rounded-lg outline-none ${
                    !fixed ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-color)',
                    borderColor: 'var(--border-soft)',
                  }}
                  onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            {/* DELIVERY TYPE */}
            <h3 className="mt-10 mb-5 text-lg font-semibold">Delivery Type</h3>

            <div className="grid grid-cols-4 gap-6">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setVehicleId(v.id)}
                  className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center gap-3 transition-all`}
                  style={{
                    borderColor:
                      vehicleId === v.id ? 'var(--highlight-color)' : 'var(--border-soft)',
                    backgroundColor:
                      vehicleId === v.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-color)',
                  }}
                  onMouseEnter={(e) => {
                    if (vehicleId !== v.id) e.currentTarget.style.borderColor = 'var(--text-color)';
                  }}
                  onMouseLeave={(e) => {
                    if (vehicleId !== v.id)
                      e.currentTarget.style.borderColor = 'var(--border-soft)';
                  }}
                >
                  <div className="text-4xl">{v.icon}</div>
                  <p className="font-medium">{v.name}</p>
                </div>
              ))}
            </div>

            <div
              className="flex justify-end gap-4 mt-10 pt-6 border-t"
              style={{ borderColor: 'var(--border-soft)' }}
            >
              <button
                onClick={save}
                className="text-white px-8 py-2 rounded-lg transition hover:opacity-90 shadow-sm"
                style={{ backgroundColor: 'var(--highlight-color)' }}
              >
                {editId ? 'Update' : 'Save'}
              </button>

              <button
                onClick={() => setShowNew(false)}
                className="border px-8 py-2 rounded-lg transition hover:opacity-75"
                style={{ borderColor: 'var(--border-soft)', color: 'var(--text-color)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div
        className="rounded-xl shadow-lg border overflow-hidden mt-2"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-soft)' }}
      >
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: 'var(--border-soft)', color: 'var(--text-color)' }}>
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
            {paginatedRows.map((r) => (
              <tr
                key={r.id}
                className="border-t transition"
                style={{ borderColor: 'var(--border-soft)', color: 'var(--text-color)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'rgba(150, 150, 150, 0.05)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td className="px-6 py-4 font-medium">{r.name}</td>
                <td className="px-6 py-4" style={{ opacity: 0.9 }}>
                  {r.vehicle}
                </td>
                <td className="px-6 py-4" style={{ opacity: 0.9 }}>
                  {r.fixed ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4" style={{ opacity: 0.9 }}>
                  ₹ {r.cost}
                </td>
                <td
                  className="px-6 py-4 font-medium"
                  style={{ color: r.active ? 'var(--highlight-color)' : '#ef4444' }}
                >
                  {r.active ? 'Active' : 'Inactive'}
                </td>
                <td className="px-6 py-4 space-x-4">
                  <button
                    onClick={() => editRow(r)}
                    className="transition hover:opacity-75 font-medium"
                    style={{ color: 'var(--highlight-color)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => delRow(r.id)}
                    className="text-red-500 font-medium transition hover:opacity-75"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!paginatedRows.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center"
                  style={{ color: 'var(--text-color)', opacity: 0.6 }}
                >
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
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40 transition hover:opacity-80"
              style={{ borderColor: 'var(--border-soft)', color: 'var(--text-color)' }}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded transition`}
                style={{
                  borderColor: 'var(--border-soft)',
                  backgroundColor: currentPage === i + 1 ? 'var(--highlight-color)' : 'transparent',
                  color: currentPage === i + 1 ? '#fff' : 'var(--text-color)',
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40 transition hover:opacity-80"
              style={{ borderColor: 'var(--border-soft)', color: 'var(--text-color)' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
