// app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { usePoolStore } from "@/store/usePoolStore";
import PoolNavigation from "@/components/PoolNavigation/PoolNavigation";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";

export default function AdminPage() {
  const { pools, allInvestors, createPool, addToPool, deletePool, initialize } =
    usePoolStore();
  const [poolToDelete, setPoolToDelete] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={createPool}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Create New Pool
      </button>
      <PoolNavigation />

      {Object.entries(pools).map(([poolId, pool]) => {
        const availableInvestors = allInvestors.filter(
          (inv) => !pool.weeks.flat().some((i) => i.id === inv.id)
        );

        return (
          <div key={poolId} className="border p-4 rounded-lg mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{pool.name}</h2>
              <button
                onClick={() => setPoolToDelete(poolId)}
                className="text-red-500 hover:text-red-700"
              >
                Delete Pool
              </button>
            </div>
            {pool.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="mb-4 p-3 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Week {weekIndex + 1}</h3>

                <div className="flex flex-wrap gap-2 mb-2">
                  {week.map((investor) => (
                    <div
                      key={investor.id}
                      className="flex items-center gap-2 bg-white p-2 rounded"
                    >
                      <img
                        src={investor.avatar}
                        className="w-8 h-8 rounded-full"
                        alt={investor.name}
                      />
                      <span className="text-sm">{investor.name}</span>
                    </div>
                  ))}
                </div>

                {week.length < 7 && (
                  <select
                    className="border p-2 rounded"
                    onChange={(e) => {
                      if (e.target.value) {
                        addToPool(poolId, weekIndex, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">Select investor</option>
                    {availableInvestors.map((investor) => (
                      <option key={investor.id} value={investor.id}>
                        {investor.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        );
      })}
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
        message="Are you sure you want to delete this pool? This action cannot be undone."
      />
    </div>
  );
}
