"use client";
import Link from "next/link";
import { usePoolStore } from "@/store/usePoolStore";

export default function FoundersListPage() {
  const { founders, pools } = usePoolStore();

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Founders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {founders.map((founder) => {
          const founderPools = Object.values(pools).filter((pool) =>
            pool.assignedFounders.includes(founder.id)
          );

          return (
            <Link
              key={founder.id}
              href={`/founders/${founder.id}`}
              className="border p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h2 className="font-bold text-lg">{founder.name}</h2>
              <p className="text-gray-600 mt-2">
                {founderPools.length > 0
                  ? `${founderPools.length} assigned pools`
                  : "No pools assigned"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
