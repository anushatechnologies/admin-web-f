import { useEffect, useRef, useState } from "react";

type Delivery = {
  id: number;
  name: string;
  phone: string;
  regNo: string;
  pin: string;
  active: boolean;
  idProof?: string;
  idProofName?: string;
};

const AUTO_DELETE_MS = 60 * 1000;
const PAGE_SIZE = 5;

export default function App() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pinRefs = useRef<HTMLInputElement[]>([]);
  const autoDeleteRef = useRef<number | null>(null);

  const [showPinMap, setShowPinMap] = useState<Record<number, boolean>>({});
  const [showPhoneMap, setShowPhoneMap] = useState<Record<number, boolean>>({});

  const [form, setForm] = useState({
    name: "",
    phone: "",
    regNo: "",
    pin: ["", "", "", ""],
    active: true,
    idProof: "",
    idProofName: "",
  });

  /* ================= FILTER ================= */
  const filtered = deliveries.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  /* ================= HELPERS ================= */
  const maskPhone = (p: string) =>
    p.length > 6 ? `${p.slice(0, 3)}****${p.slice(-3)}` : p;

  const handlePinChange = (i: number, v: string) => {
    const newPin = [...form.pin];
    newPin[i] = v.replace(/[^0-9]/g, "").slice(-1);
    setForm({ ...form, pin: newPin });
    if (v && pinRefs.current[i + 1]) pinRefs.current[i + 1].focus();
  };

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setForm({
        ...form,
        idProof: reader.result as string,
        idProofName: file.name,
      });

      if (autoDeleteRef.current) clearTimeout(autoDeleteRef.current);

      autoDeleteRef.current = window.setTimeout(() => {
        setForm((prev) => ({ ...prev, idProof: "", idProofName: "" }));
      }, AUTO_DELETE_MS);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      regNo: "",
      pin: ["", "", "", ""],
      active: true,
      idProof: "",
      idProofName: "",
    });
    setEditId(null);
  };

  /* ================= SAVE ================= */
  const saveDelivery = () => {
    if (!form.name || !form.phone || form.pin.join("").length !== 4)
      return alert("Fill all required fields");

    if (editId) {
      setDeliveries(
        deliveries.map((d) =>
          d.id === editId ? { ...d, ...form, pin: form.pin.join("") } : d
        )
      );
    } else {
      setDeliveries([
        {
          id: Date.now(),
          name: form.name,
          phone: form.phone,
          regNo: form.regNo,
          pin: form.pin.join(""),
          active: form.active,
          idProof: form.idProof,
          idProofName: form.idProofName,
        },
        ...deliveries,
      ]);
    }

    resetForm();
    setShowModal(false);
  };

  const editDelivery = (d: Delivery) => {
    setShowModal(true);
    setEditId(d.id);
    setForm({
      name: d.name,
      phone: d.phone,
      regNo: d.regNo,
      pin: d.pin.split(""),
      active: d.active,
      idProof: d.idProof || "",
      idProofName: d.idProofName || "",
    });
  };

  const deleteDelivery = (id: number) =>
    setDeliveries(deliveries.filter((d) => d.id !== id));

  useEffect(() => {
    return () =>
      autoDeleteRef.current && clearTimeout(autoDeleteRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Delivery Management
          </h1>

          <div className="flex gap-4">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Search delivery..."
            />

            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              + Add Delivery
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">PIN</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No Records Found
                  </td>
                </tr>
              )}

              {paginated.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{d.name}</td>

                  <td className="px-6 py-4">
                    {showPhoneMap[d.id] ? d.phone : maskPhone(d.phone)}
                    <button
                      onClick={() =>
                        setShowPhoneMap((p) => ({
                          ...p,
                          [d.id]: !p[d.id],
                        }))
                      }
                      className="ml-2 text-indigo-600"
                    >
                      👁
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    {showPinMap[d.id] ? d.pin : "****"}
                    <button
                      onClick={() =>
                        setShowPinMap((p) => ({
                          ...p,
                          [d.id]: !p[d.id],
                        }))
                      }
                      className="ml-2 text-indigo-600"
                    >
                      👁
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    {d.active ? (
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => editDelivery(d)}
                      className="text-indigo-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDelivery(d.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-6">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {"<<"}
              </button>

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {"<"}
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {">"}
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {">>"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] rounded-xl shadow-2xl p-6 relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6">
              {editId ? "Edit Delivery" : "Add Delivery"}
            </h2>

            <div className="space-y-4">

              <input
                placeholder="Full Name *"
                className="w-full border rounded-lg px-4 py-2"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Phone Number *"
                className="w-full border rounded-lg px-4 py-2"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <input
                placeholder="Registration No"
                className="w-full border rounded-lg px-4 py-2"
                value={form.regNo}
                onChange={(e) =>
                  setForm({ ...form, regNo: e.target.value })
                }
              />

              <div className="flex gap-3">
                {form.pin.map((p, i) => (
                  <input
                    key={i}
                    ref={(el) => el && (pinRefs.current[i] = el)}
                    maxLength={1}
                    value={p}
                    onChange={(e) =>
                      handlePinChange(i, e.target.value)
                    }
                    className="w-14 h-14 text-center text-xl border rounded-lg"
                  />
                ))}
              </div>

              <label className="border-2 border-dashed border-indigo-400 rounded-lg p-6 text-center cursor-pointer hover:bg-indigo-50 transition block">
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    e.target.files && handleImage(e.target.files[0])
                  }
                />
                <p className="text-indigo-600 font-medium">
                  Click to Upload ID Proof
                </p>
              </label>

              {form.idProof && (
                <div>
                  <img
                    src={form.idProof}
                    className="w-24 h-24 rounded-lg border"
                  />
                  <p className="text-sm">{form.idProofName}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={saveDelivery}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  {editId ? "Update" : "Save"}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}