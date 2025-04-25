// app/founder/[poolId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { usePoolStore } from "@/store/usePoolStore";
import Link from "next/link";

export default function FounderPage({
  params,
}: {
  params: { poolId: string };
}) {
  const { pools, initialize } = usePoolStore();
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    initialize();
  }, []);

  const pool = pools[params.poolId];

  if (!pool)
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Pool not found</h2>
        <p>The pool you're looking for may have been deleted.</p>
        <Link
          href="/admin"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Return to Admin
        </Link>
      </div>
    );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{pool.name}</h1>

      {/* Week Navigation */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((week) => (
          <button
            key={week}
            onClick={() => setCurrentWeek(week - 1)}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentWeek === week - 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Week {week}
          </button>
        ))}
      </div>

      {/* Investor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
        {pool.weeks[currentWeek].map((investor) => (
          <div
            key={investor.id}
            className="flex flex-col items-center p-3 rounded-lg bg-white shadow-sm"
          >
            <img
              src={investor.avatar}
              className="w-16 h-16 rounded-full mb-2 object-cover"
              alt={investor.name}
            />
            <h3 className="font-medium text-center">{investor.name}</h3>
            <p className="text-xs text-gray-500 text-center">
              {investor.company}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
