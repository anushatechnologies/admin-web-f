import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import AddForm from './add_store';
import {
  fetchStores,
  createStore,
  updateStore,
  deleteStore,
  Store as ApiStore,
  StoreRequest,
} from '../api/storeapi';

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
  const [search, setSearch] = useState('');
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
      toast.error(error.message || 'Failed to load stores');
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
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCreate = async (storeData: StoreRequest, imageFile?: File) => {
    try {
      await createStore(storeData, imageFile);
      await loadStores();
      setShowModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create store');
    }
  };

  const handleUpdate = async (id: number, storeData: StoreRequest, imageFile?: File) => {
    try {
      await updateStore(id, storeData, imageFile);
      await loadStores();
      setShowModal(false);
      setEditData(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update store');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this store?')) return;
    try {
      await deleteStore(id);
      if (stores.length % ITEMS_PER_PAGE === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
      await loadStores();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete store');
    }
  };

  return (
    <div
      className="min-h-screen p-10"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
            Store
          </h1>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name..."
              className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              style={{
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-color)',
                borderColor: 'var(--border-soft)',
              }}
            />
            <button
              onClick={() => {
                setEditData(null);
                setShowModal(true);
              }}
              className="text-white px-6 py-2 rounded-lg shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: 'var(--highlight-color)' }}
            >
              + Add Store
            </button>
          </div>
        </div>

        <div
          className="rounded-xl shadow-lg border overflow-x-auto"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-soft)' }}
        >
          <table className="min-w-[1400px] text-sm">
            <thead style={{ backgroundColor: 'var(--border-soft)', color: 'var(--text-color)' }}>
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Name</th>
                <th className="px-4 py-4 text-left font-semibold">Address</th>
                <th className="px-4 py-4 text-left font-semibold">Price Range</th>
                <th className="px-4 py-4 text-left font-semibold">Phone</th>
                <th className="px-4 py-4 text-left font-semibold">Pincode</th>
                <th className="px-4 py-4 text-left font-semibold">City</th>
                <th className="px-4 py-4 text-left font-semibold">Announcement</th>
                <th className="px-4 py-4 text-left font-semibold">Delivery</th>
                <th className="px-4 py-4 text-left font-semibold">Package</th>
                <th className="px-4 py-4 text-left font-semibold">Active</th>
                <th className="px-4 py-4 text-left font-semibold">Rating</th>
                <th className="px-4 py-4 text-left font-semibold">Image</th>
                <th className="px-4 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={13} className="text-center py-10" style={{ opacity: 0.6 }}>
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && currentData.length === 0 && (
                <tr>
                  <td colSpan={13} className="text-center py-10" style={{ opacity: 0.6 }}>
                    No Records Found
                  </td>
                </tr>
              )}
              {!loading &&
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b transition"
                    style={{ borderColor: 'var(--border-soft)' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(150, 150, 150, 0.05)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 opacity-90">{item.address}</td>
                    <td className="px-4 py-3 opacity-90">{item.priceRange}</td>
                    <td className="px-4 py-3 opacity-90">{item.phoneNumber}</td>
                    <td className="px-4 py-3 opacity-90">{item.pincode}</td>
                    <td className="px-4 py-3 opacity-90">{item.city}</td>
                    <td className="px-4 py-3 opacity-90">{item.announcement}</td>
                    <td className="px-4 py-3 opacity-90">{item.delivery}</td>
                    <td className="px-4 py-3 opacity-90">{item.packageCost}</td>
                    <td className="px-4 py-3">
                      {item.active ? (
                        <span className="text-green-500 font-medium">Active</span>
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
                          className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                          style={{ borderColor: 'var(--border-soft)' }}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => {
                          setEditData(item);
                          setShowModal(true);
                        }}
                        className="text-white px-3 py-1 rounded text-xs transition hover:opacity-80 shadow-sm"
                        style={{ backgroundColor: 'var(--highlight-color)' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs transition hover:opacity-80 shadow-sm"
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
                className="px-3 py-1 border rounded disabled:opacity-50 transition hover:opacity-80"
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
                    backgroundColor:
                      currentPage === i + 1 ? 'var(--highlight-color)' : 'transparent',
                    color: currentPage === i + 1 ? '#fff' : 'var(--text-color)',
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 transition hover:opacity-80"
                style={{ borderColor: 'var(--border-soft)', color: 'var(--text-color)' }}
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
