"use client";
import { useEffect, useState } from "react";
import { usePoolStore } from "@/store/usePoolStore";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import PoolManager from "@/components/PoolManager/PoolManager";

export default function AdminPage() {
  const { founders, createPool, initialize } = usePoolStore();

  const [newPoolName, setNewPoolName] = useState("");
  const [selectedFounders, setSelectedFounders] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initialize();
      setIsInitialized(true);
    };
    init();
  }, [initialize]);

  const handleCreatePool = () => {
    if (!newPoolName.trim()) return;
    createPool(newPoolName, selectedFounders);
    setNewPoolName("");
    setSelectedFounders([]);
  };

  if (!isInitialized) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Pool Creation Section */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Create New Pool</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">Pool Name*</label>
            <input
              value={newPoolName}
              onChange={(e) => setNewPoolName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter pool name"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Assign to Founders</label>
            <select
              multiple
              value={selectedFounders}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions);
                setSelectedFounders(options.map((opt) => opt.value));
              }}
              className="w-full border p-2 rounded min-h-[42px]"
              size={3}
            >
              {founders.map((founder) => (
                <option key={founder.id} value={founder.id}>
                  {founder.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple
            </p>
          </div>
        </div>

        <button
          onClick={handleCreatePool}
          disabled={!newPoolName.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create Pool
        </button>
      </div>

      {/* Pool Management Section */}
      <PoolManager />
    </div>
  );
}
