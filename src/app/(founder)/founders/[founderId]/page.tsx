"use client";
import { usePoolStore } from "@/store/usePoolStore";
import Link from "next/link";
import { use, useState } from "react";

export default function FounderDetailPage({
  params,
}: {
  params: Promise<{ founderId: string }>;
}) {
  const { founderId } = use(params); // ✅ unwraps the params

  const { pools, founders } = usePoolStore();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);

  const founder = founders.find((f) => f.id === founderId);

  const founderPools = Object.values(pools).filter((pool) =>
    pool.assignedFounders.includes(founderId)
  );

  if (!founder) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Founder not found</h2>
        <Link
          href="/founders"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Founders
        </Link>
      </div>
    );
  }

  const selectedPool = selectedPoolId ? pools[selectedPoolId] : null;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {founder.name}'s Investor Pools
          </h1>
          <p className="text-gray-600 mt-1">
            {founderPools.length} pool(s) assigned
          </p>
        </div>
        <Link href="/founders" className="text-blue-500 hover:underline">
          Back to All Founders
        </Link>
      </div>

      {/* Pool Selection */}
      {founderPools.length > 0 ? (
        <>
          <div className="mb-6">
            <label className="block font-medium mb-2">Select Pool:</label>
            <select
              value={selectedPoolId || ""}
              onChange={(e) => setSelectedPoolId(e.target.value || null)}
              className="border p-2 rounded w-full md:w-1/2"
            >
              <option value="">Select a pool</option>
              {founderPools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name} ({pool.weeks.length} weeks)
                </option>
              ))}
            </select>
          </div>

          {selectedPool && (
            <>
              {/* Week Navigation */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {selectedPool.weeks.map((week) => (
                  <button
                    key={week.weekNumber}
                    onClick={() => setCurrentWeek(week.weekNumber)}
                    className={`px-4 py-2 rounded ${
                      currentWeek === week.weekNumber
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Week {week.weekNumber}
                  </button>
                ))}
              </div>

              {/* Investor Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {selectedPool.weeks
                  .find((w) => w.weekNumber === currentWeek)
                  ?.investors.map((investor) => (
                    <div
                      key={investor.id}
                      className="bg-white p-4 rounded-lg shadow-sm text-center border"
                    >
                      <img
                        src={investor.avatar}
                        className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                        alt={investor.name}
                      />
                      <h3 className="font-medium">{investor.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {investor.company}
                      </p>
                    </div>
                  ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center py-8 border rounded bg-gray-50">
          <p className="text-gray-500 mb-4">
            No pools assigned to this founder yet
          </p>
          <Link
            href="/admin"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
          >
            Assign Pools in Admin
          </Link>
        </div>
      )}
    </div>
  );
}
