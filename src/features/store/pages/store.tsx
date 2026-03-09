import { useState, useEffect, useCallback } from "react";
import AddForm from "./add_store";
import {
  fetchStores,
  createStore,
  updateStore,
  deleteStore,
  Store as ApiStore,
  StoreRequest,
} from "../api/storeapi";

const ITEMS_PER_PAGE = 5;

type StoreType = {
  id: number;
  name: string;
  address: string;
  priceRange: string;
  phoneNumber: string;
  pincode: string;
  city: string;
  announcement: string;
  delivery: string;
  packageCost: string;
  active: boolean;
  rating: number;
  image?: string;
  preferredOrder: number;
  timings: string;
};

export default function StoreList() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<StoreType | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStores(debouncedSearch || undefined);
      const mapped: StoreType[] = data.map((item) => ({
        ...item,
        image: item.imageUrl,
      }));
      setStores(mapped);
      setCurrentPage(1);
    } catch (error: any) {
      alert(error.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const totalPages = Math.ceil(stores.length / ITEMS_PER_PAGE);
  const currentData = stores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreate = async (storeData: StoreRequest, imageFile?: File) => {
    try {
      await createStore(storeData, imageFile);
      await loadStores();
      setShowModal(false);
    } catch (error: any) {
      alert(error.message || "Failed to create store");
    }
  };

  const handleUpdate = async (
    id: number,
    storeData: StoreRequest,
    imageFile?: File
  ) => {
    try {
      await updateStore(id, storeData, imageFile);
      await loadStores();
      setShowModal(false);
      setEditData(null);
    } catch (error: any) {
      alert(error.message || "Failed to update store");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    try {
      await deleteStore(id);
      if (stores.length % ITEMS_PER_PAGE === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
      await loadStores();
    } catch (error: any) {
      alert(error.message || "Failed to delete store");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Store</h1>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name..."
              className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={() => {
                setEditData(null);
                setShowModal(true);
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              + Add Store
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="min-w-[1400px] text-sm">
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="px-4 py-4 text-left">Name</th>
                <th className="px-4 py-4 text-left">Address</th>
                <th className="px-4 py-4 text-left">Price Range</th>
                <th className="px-4 py-4 text-left">Phone</th>
                <th className="px-4 py-4 text-left">Pincode</th>
                <th className="px-4 py-4 text-left">City</th>
                <th className="px-4 py-4 text-left">Announcement</th>
                <th className="px-4 py-4 text-left">Delivery</th>
                <th className="px-4 py-4 text-left">Package</th>
                <th className="px-4 py-4 text-left">Active</th>
                <th className="px-4 py-4 text-left">Rating</th>
                <th className="px-4 py-4 text-left">Image</th>
                <th className="px-4 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={13} className="text-center py-10">Loading...</td></tr>
              )}
              {!loading && currentData.length === 0 && (
                <tr><td colSpan={13} className="text-center py-10">No Records Found</td></tr>
              )}
              {!loading &&
                currentData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.address}</td>
                    <td className="px-4 py-3">{item.priceRange}</td>
                    <td className="px-4 py-3">{item.phoneNumber}</td>
                    <td className="px-4 py-3">{item.pincode}</td>
                    <td className="px-4 py-3">{item.city}</td>
                    <td className="px-4 py-3">{item.announcement}</td>
                    <td className="px-4 py-3">{item.delivery}</td>
                    <td className="px-4 py-3">{item.packageCost}</td>
                    <td className="px-4 py-3">
                      {item.active ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-red-500 font-medium">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3">⭐ {item.rating}</td>
                    <td className="px-4 py-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border"
                        />
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => {
                          setEditData(item);
                          setShowModal(true);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
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
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {showModal && (
          <AddForm
            initialData={editData ? { ...editData, imageUrl: editData.image } : null}
            onSave={(storeData, imageFile) => {
              if (editData) {
                handleUpdate(editData.id, storeData, imageFile);
              } else {
                handleCreate(storeData, imageFile);
              }
            }}
            onClose={() => {
              setShowModal(false);
              setEditData(null);
            }}
          />
        )}
      </div>
    </div>
  );
}