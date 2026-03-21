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
import { fetchStores as fetchMainStores, Store as MainStore } from '../../store/api/storeApi';
import ReusableTable from '../../../components/common/ReusableTable';
import ConfirmDialog from '../../../components/ConfirmDialog';

type StoreType = {
  id: number;
  name: string;
  label: string;
  displayOrder: number;
  active: boolean;
  image?: string;
  store1Id: number;
};

const ITEMS_PER_PAGE = 5;

export default function StoreTypePage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<StoreType | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mainStoresMap, setMainStoresMap] = useState<Map<number, string>>(new Map());
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // Load main stores for name mapping
  useEffect(() => {
    const loadMainStores = async () => {
      try {
        const data = await fetchMainStores();
        if (Array.isArray(data)) {
          const map = new Map(data.map((ms) => [ms.id, ms.name]));
          setMainStoresMap(map);
        }
      } catch (error) {
        console.error('Failed to load main stores', error);
      }
    };
    loadMainStores();
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStores(debouncedSearch || undefined, currentPage - 1, ITEMS_PER_PAGE);
      const content = data?.content || [];
      const mapped: StoreType[] = content.map((item: any) => ({
        ...item,
        image: item.imageUrl,
      }));
      setStores(mapped);
      setTotalPages(data?.totalPages || 0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleCreate = async (storeData: StoreRequest, imageFile?: File) => {
    if (!imageFile) {
      toast.error('Image is required');
      return;
    }
    try {
      await createStore(storeData, imageFile);
      await loadStores();
      setShowModal(false);
      toast.success('Store type created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create store type');
    }
  };

  const handleUpdate = async (id: number, storeData: StoreRequest, imageFile?: File) => {
    try {
      await updateStore(id, storeData, imageFile);
      await loadStores();
      setShowModal(false);
      setEditData(null);
      toast.success('Store type updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update store type');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStore(id);
      toast.success('Store type deleted successfully');
      if (stores.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        await loadStores();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete store type');
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
            Store Type
          </h1>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
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
              + Add Store Type
            </button>
          </div>
        </div>

        <ReusableTable
          columns={[
            { header: 'Name', key: 'name' },
            { header: 'Label', key: 'label' },
            { header: 'Display Order', key: 'displayOrder' },
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
              header: 'Main Store',
              key: 'store1Id',
              render: (item: StoreType) => mainStoresMap.get(item.store1Id) || item.store1Id || '-',
            },
            {
              header: 'Image',
              key: 'image',
              render: (item: StoreType) =>
                item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg shadow-sm border"
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
                    className="text-white px-3 py-1 rounded text-xs shadow-sm transition hover:opacity-80"
                    style={{ backgroundColor: 'var(--highlight-color)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmId(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs shadow-sm transition hover:opacity-80"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={stores}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {showModal && (
          <AddForm
            initialData={editData ? { ...editData, image: editData.image } : null}
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
        title="Delete Store Type"
        message="Are you sure you want to delete this store type?"
        onConfirm={() => {
          if (confirmId !== null) handleDelete(confirmId);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}