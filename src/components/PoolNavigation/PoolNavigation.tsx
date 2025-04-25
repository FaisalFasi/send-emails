// components/PoolNavigation.tsx
"use client";
import Link from "next/link";
import { usePoolStore } from "@/store/usePoolStore";

export default function PoolNavigation() {
  const { pools } = usePoolStore();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Investor Pools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(pools).map((pool) => (
          <Link
            key={pool.id}
            href={`/founder/${pool.id}`}
            className="border p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">{pool.name}</h3>
            <p className="text-sm text-gray-600">
              {pool.weeks.flat().length} investors across 5 weeks
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
