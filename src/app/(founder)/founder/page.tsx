// Simple version without drag-and-drop
"use client";
import { useState } from "react";
import { usePoolStore } from "@/store/usePoolStore";

export default function FoundersPage() {
  const {
    founders,
    allInvestors,
    assignInvestorToFounder,
    unassignInvestorFromFounder,
  } = usePoolStore();
  const [selectedFounder, setSelectedFounder] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Founder-Investor Assignments</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Founder List */}
        <div className="space-y-2">
          <h2 className="font-bold mb-2">Founders</h2>
          {founders.map((founder) => (
            <button
              key={founder.id}
              onClick={() => setSelectedFounder(founder.id)}
              className={`w-full text-left p-2 rounded ${
                selectedFounder === founder.id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              {founder.name}
            </button>
          ))}
        </div>

        {/* Assignment Area */}
        <div className="md:col-span-3">
          {selectedFounder ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Available Investors */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-3">Available Investors</h3>
                {allInvestors
                  .filter(
                    (inv) =>
                      !founders.some((f) =>
                        f.assignedInvestors.includes(inv.id)
                      )
                  )
                  .map((investor) => (
                    <div
                      key={investor.id}
                      className="flex items-center p-2 hover:bg-gray-100 rounded"
                    >
                      <img
                        src={investor.avatar}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="flex-grow">{investor.name}</span>
                      <button
                        onClick={() =>
                          assignInvestorToFounder(selectedFounder, investor.id)
                        }
                        className="text-blue-500"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
              </div>

              {/* Assigned Investors */}
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold mb-3">Assigned Investors</h3>
                {founders
                  .find((f) => f.id === selectedFounder)
                  ?.assignedInvestors.map((investorId) => {
                    const investor = allInvestors.find(
                      (inv) => inv.id === investorId
                    );
                    if (!investor) return null;

                    return (
                      <div
                        key={investor.id}
                        className="flex items-center p-2 hover:bg-blue-100 rounded"
                      >
                        <img
                          src={investor.avatar}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="flex-grow">{investor.name}</span>
                        <button
                          onClick={() =>
                            unassignInvestorFromFounder(
                              selectedFounder,
                              investor.id
                            )
                          }
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a founder to assign investors
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
