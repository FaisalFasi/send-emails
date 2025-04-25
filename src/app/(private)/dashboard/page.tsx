"use client";
import { useEffect, useState } from "react";
import { usePoolStore } from "@/store/usePoolStore";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import Image from "next/image";

export default function AdminPage() {
  const {
    pools,
    founders,
    allInvestors,
    addToPool,
    createPool,
    addWeek,
    removeWeek,
    deletePool,
    assignFounderToPool,
    removeFounderFromPool,
    initialize,
  } = usePoolStore();

  const [newPoolName, setNewPoolName] = useState("");
  const [selectedFounders, setSelectedFounders] = useState<string[]>([]);
  const [poolToDelete, setPoolToDelete] = useState<string | null>(null);
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
      {Object.entries(pools).length === 0 ? (
        <div className="text-center py-8 border rounded bg-gray-50">
          <p className="text-gray-500">No pools created yet</p>
        </div>
      ) : (
        Object.entries(pools).map(([poolId, pool]) => (
          <div key={poolId} className="mb-8 border p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold break-all">{pool.name}</h2>
                <div className="mt-2">
                  <label className="font-medium mr-2">Assigned Founders:</label>
                  {pool.assignedFounders.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {pool.assignedFounders.map((founderId) => {
                        const founder = founders.find(
                          (f) => f.id === founderId
                        );
                        return (
                          <span
                            key={founderId}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                          >
                            {founder?.name}
                            <button
                              onClick={() =>
                                removeFounderFromPool(poolId, founderId)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      No founders assigned
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {pool.weeks.length < 5 && (
                  <button
                    onClick={() => addWeek(poolId)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Add Week
                  </button>
                )}
                <button
                  onClick={() => setPoolToDelete(poolId)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete Pool
                </button>
              </div>
            </div>

            {/* Founder Assignment */}
            <div className="mb-4">
              <label className="font-medium mr-2">Add Founder:</label>
              <select
                onChange={(e) => {
                  if (
                    e.target.value &&
                    !pool.assignedFounders.includes(e.target.value)
                  ) {
                    assignFounderToPool(poolId, e.target.value);
                    e.target.value = "";
                  }
                }}
                className="border p-1 rounded mr-2"
                defaultValue=""
              >
                <option value="">Select founder</option>
                {founders
                  .filter((f) => !pool.assignedFounders.includes(f.id))
                  .map((founder) => (
                    <option key={founder.id} value={founder.id}>
                      {founder.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Week Management */}
            {pool.weeks.map((week) => (
              <div
                key={week.weekNumber}
                className="mb-4 p-3 bg-gray-50 rounded border"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Week {week.weekNumber}</h3>
                  {pool.weeks.length > 1 && (
                    <button
                      onClick={() => removeWeek(poolId, week.weekNumber)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remove Week
                    </button>
                  )}
                </div>

                {/* Investor Assignment */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {week.investors.length > 0 ? (
                    week.investors.map((investor) => (
                      <div
                        key={investor.id}
                        className="flex items-center gap-2 bg-white p-2 rounded border hover:bg-gray-50"
                      >
                        <Image
                          width={32}
                          height={32}
                          src={investor.avatar}
                          className="w-8 h-8 rounded-full"
                          alt={investor.name}
                        />
                        <div>
                          <p className="text-sm font-medium">{investor.name}</p>
                          <p className="text-xs text-gray-500">
                            {investor.company}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No investors added</p>
                  )}
                </div>

                {week.investors.length < 7 && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1">
                      Add Investor:
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addToPool(
                            poolId,
                            week.weekNumber - 1,
                            e.target.value
                          );
                          e.target.value = "";
                        }
                      }}
                      className="border p-2 rounded w-full"
                      defaultValue=""
                    >
                      <option value="">Select investor</option>
                      {allInvestors
                        .filter(
                          (inv) =>
                            !pool.weeks
                              .flatMap((w) => w.investors)
                              .some((i) => i.id === inv.id)
                        )
                        .map((investor) => (
                          <option key={investor.id} value={investor.id}>
                            {investor.name} ({investor.company})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!poolToDelete}
        onClose={() => setPoolToDelete(null)}
        onConfirm={() => {
          if (poolToDelete) {
            deletePool(poolToDelete);
            setPoolToDelete(null);
          }
        }}
        title="Delete Pool"
        message="Are you sure you want to delete this pool? All weeks and investor assignments will be lost."
      />
    </div>
  );
}
