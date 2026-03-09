import { useState } from "react";

type Props = {
  initialData?: any;
  onSave: (data: any, imageFile?: File) => void;
  onClose: () => void;
};

export default function AddForm({ initialData, onSave, onClose }: Props) {
  const [activeTab, setActiveTab] = useState("general");

  const [form, setForm] = useState({
    name: initialData?.name || "",
    address: initialData?.address || "",
    priceRange: initialData?.priceRange || "",
    phoneNumber: initialData?.phoneNumber || "",
    pincode: initialData?.pincode || "",
    city: initialData?.city || "",
    announcement: initialData?.announcement || "",
    delivery: initialData?.delivery || "",
    packageCost: initialData?.packageCost || "",
    active: initialData?.active ?? true,
    rating: initialData?.rating || 0,
    preferredOrder: initialData?.preferredOrder || 0,
    timings: initialData?.timings || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialData?.imageUrl
  );

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.phoneNumber || !form.address) {
      alert("Please fill required fields: Name, Phone, Address");
      return;
    }
    onSave(form, imageFile || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white w-[1200px] rounded-xl shadow-2xl p-8 my-10 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {initialData ? "Edit Store" : "Add Store"}
          </h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        <div className="flex gap-4 mb-8">
          {["general", "delivery", "geo"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {tab === "geo" ? "Geo-Fence" : tab}
            </button>
          ))}
        </div>

        {activeTab === "general" && (
          <div className="grid grid-cols-2 gap-6">
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Store Name *"
              className="border p-3 rounded-lg"
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => handleChange("active", e.target.checked)}
              />
              Active
            </label>

            <input
              value={form.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Phone Number *"
              className="border p-3 rounded-lg"
            />

            <input
              value={form.priceRange}
              onChange={(e) => handleChange("priceRange", e.target.value)}
              placeholder="Price Range (e.g., $$, 1000-5000)"
              className="border p-3 rounded-lg"
            />

            <textarea
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Address *"
              className="border p-3 rounded-lg col-span-2"
            />

            <input
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City"
              className="border p-3 rounded-lg"
            />

            <input
              value={form.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              placeholder="Pincode"
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => handleChange("rating", Number(e.target.value))}
              placeholder="Rating (0-5)"
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              value={form.preferredOrder}
              onChange={(e) => handleChange("preferredOrder", Number(e.target.value))}
              placeholder="Preferred Order (integer)"
              className="border p-3 rounded-lg"
            />

            <input
              value={form.timings}
              onChange={(e) => handleChange("timings", e.target.value)}
              placeholder="Timings (e.g., 9:00 AM - 9:00 PM)"
              className="border p-3 rounded-lg"
            />

            <textarea
              value={form.announcement}
              onChange={(e) => handleChange("announcement", e.target.value)}
              placeholder="Announcement (store note)"
              className="border p-3 rounded-lg col-span-2"
            />

            <div className="col-span-2 border-2 border-dashed border-indigo-400 p-6 text-center rounded-lg cursor-pointer hover:bg-indigo-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <p className="text-indigo-600 font-medium">
                  Click to Upload Store Image
                </p>
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-cover rounded-lg mx-auto"
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "delivery" && (
          <div className="grid grid-cols-2 gap-6">
            <input
              value={form.delivery}
              onChange={(e) => handleChange("delivery", e.target.value)}
              placeholder="Delivery (e.g., free, paid)"
              className="border p-3 rounded-lg"
            />

            <input
              value={form.packageCost}
              onChange={(e) => handleChange("packageCost", e.target.value)}
              placeholder="Package Cost (e.g., 5000)"
              className="border p-3 rounded-lg"
            />
          </div>
        )}

        {activeTab === "geo" && (
          <div className="h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
            Map / Geo‑fence integration will go here
          </div>
        )}

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="border px-6 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}