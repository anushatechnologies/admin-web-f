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
} from '../api/storeApi';
import ReusableTable from '../../../components/common/ReusableTable';
import ConfirmDialog from '../../../components/ConfirmDialog';

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
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStores(debouncedSearch || undefined);
      const mapped: StoreType[] = data.map((item: any) => ({
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
  const paginatedData = stores.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCreate = async (storeData: StoreRequest, imageFile?: File) => {
    try {
      await createStore(storeData, imageFile);
      await loadStores();
      setShowModal(false);
      toast.success('Store created successfully');
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
      toast.success('Store updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update store');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStore(id);
      toast.success('Store deleted successfully');
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

        <ReusableTable
          columns={[
            { header: 'Name', key: 'name' },
            { header: 'Address', key: 'address' },
            { header: 'Price Range', key: 'priceRange' },
            { header: 'Phone', key: 'phoneNumber' },
            { header: 'Pincode', key: 'pincode' },
            { header: 'City', key: 'city' },
            { header: 'Announcement', key: 'announcement' },
            { header: 'Delivery', key: 'delivery' },
            { header: 'Package', key: 'packageCost' },
            {
              header: 'Active',
              key: 'active',
              render: (item: StoreType) =>
                item.active ? (
                  <span className="text-green-500 font-medium">Active</span>
                ) : (
                  <span className="text-red-500 font-medium">Inactive</span>
                ),
            },
            {
              header: 'Rating',
              key: 'rating',
              render: (item: StoreType) => `⭐ ${item.rating || 0}`,
            },
            {
              header: 'Image',
              key: 'image',
              render: (item: StoreType) =>
                item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                    style={{ borderColor: 'var(--border-soft)' }}
                  />
                ) : (
                  '-'
                ),
            },
            {
              header: 'Action',
              key: 'id',
              render: (item: StoreType) => (
                <div className="space-x-2">
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
                    onClick={() => setConfirmId(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs transition hover:opacity-80 shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={paginatedData}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

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

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Store"
        message="Are you sure you want to delete this store?"
        onConfirm={() => {
          if (confirmId !== null) handleDelete(confirmId);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}