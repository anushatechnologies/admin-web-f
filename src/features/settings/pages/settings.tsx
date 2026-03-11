import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

type Settings = {
  showErrorsAtMobile: boolean;
  imageClassificationRating: number;
  apiVersionId: string;
  bucketUrl: string;
  clearOrderDataAfter: string;
  appRefresh: string;
  currency: string;
};

const DEFAULT_SETTINGS: Settings = {
  showErrorsAtMobile: false,
  imageClassificationRating: 0.74,
  apiVersionId: 'v1',
  bucketUrl: 'uploads/example',
  clearOrderDataAfter: '2 years',
  appRefresh: '60 seconds',
  currency: 'Rupee',
};

export default function App() {
  const [isEditing, setIsEditing] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    ...DEFAULT_SETTINGS,
  });

  const savedRef = useRef<Settings>({
    ...DEFAULT_SETTINGS,
  });

  const handleChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    savedRef.current = JSON.parse(JSON.stringify(settings));
    setIsEditing(false);
    toast.success('Settings saved!');
  };

  const handleRefresh = () => {
    const snapshot = JSON.parse(JSON.stringify(savedRef.current));
    setSettings(snapshot);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="bg-white w-[520px] rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">App Settings</h2>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500">
            Version: {settings.apiVersionId}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <Row label="Show Errors At Mobile">
            <Toggle
              enabled={settings.showErrorsAtMobile}
              disabled={!isEditing}
              onChange={(val) => handleChange('showErrorsAtMobile', val)}
            />
          </Row>

          <Row label="Image Classification Rating">
            <input
              type="number"
              step="0.01"
              value={settings.imageClassificationRating}
              disabled={!isEditing}
              onChange={(e) => handleChange('imageClassificationRating', Number(e.target.value))}
              className="w-28 border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
          </Row>

          <Row label="API Version ID">
            <input
              value={settings.apiVersionId}
              disabled
              className="w-28 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500 cursor-not-allowed"
            />
          </Row>

          <Row label="Bucket URL">
            <input
              value={settings.bucketUrl}
              disabled
              className="w-44 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500 cursor-not-allowed"
            />
          </Row>

          <Row label="Clear order data after">
            <select
              value={settings.clearOrderDataAfter}
              disabled={!isEditing}
              onChange={(e) => handleChange('clearOrderDataAfter', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            >
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="5 years">5 years</option>
            </select>
          </Row>

          <Row label="App Refresh">
            <select
              value={settings.appRefresh}
              disabled={!isEditing}
              onChange={(e) => handleChange('appRefresh', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            >
              <option value="30 seconds">30 seconds</option>
              <option value="60 seconds">60 seconds</option>
              <option value="120 seconds">120 seconds</option>
            </select>
          </Row>

          <Row label="Currency">
            <select
              value={settings.currency}
              disabled={!isEditing}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            >
              <option value="Rupee">Rupee</option>
              <option value="Dollar">Dollar</option>
              <option value="Euro">Euro</option>
            </select>
          </Row>

          {/* Buttons */}
          <div className="pt-4 border-t border-gray-200">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm"
              >
                Edit Settings
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition shadow-sm"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-300 transition"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= ROW COMPONENT ================= */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium text-sm text-gray-700">{label}</span>
      {children}
    </div>
  );
}

/* ================= TOGGLE COMPONENT ================= */

function Toggle({
  enabled,
  disabled,
  onChange,
}: {
  enabled: boolean;
  disabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition
        ${enabled ? 'bg-blue-600' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}
