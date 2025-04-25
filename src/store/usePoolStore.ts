// stores/usePoolStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Founder, Investor, InvestorPool } from "@/types/InvestorsTypes";

type PoolStore = {
  pools: Record<string, InvestorPool>;
  allInvestors: Investor[];
  createPool: () => string;
  addToPool: (poolId: string, week: number, investorId: string) => void;
  updateInvestor: (
    poolId: string,
    week: number,
    investorId: string,
    updates: Partial<Investor>
  ) => void;
  initialize: () => void;
  deletePool: (poolId: string) => void;

  //founder
  founders: Founder[];
  assignInvestorToFounder: (founderId: string, investorId: string) => void;
  unassignInvestorFromFounder: (founderId: string, investorId: string) => void;
};

export const usePoolStore = create<PoolStore>()(
  persist(
    (set, get) => ({
      pools: {},
      founders: [],
      allInvestors: [],

      initialize: () => {
        if (get().allInvestors.length > 0) return;

        set({
          allInvestors: Array.from({ length: 50 }, (_, i) => ({
            id: `inv-${i}`,
            name: `Investor ${i}`,
            avatar: `https://i.pravatar.cc/150?img=${i}`,
            company: `Company ${i % 10}`, // Now required
            contact: i % 3 === 0 ? undefined : `contact${i}@example.com`,
          })),
        });
      },

      createPool: () => {
        const poolId = Date.now().toString();
        set((state) => ({
          pools: {
            ...state.pools,
            [poolId]: {
              id: poolId,
              name: `Pool ${Object.keys(state.pools).length + 1}`,
              weeks: Array(5).fill([]),
            },
          },
        }));
        return poolId;
      },

      addToPool: (poolId, week, investorId) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool) return {};

          // Check if investor exists in any week
          const exists = pool.weeks.flat().some((inv) => inv.id === investorId);
          if (exists) return {};

          // Add if week has <7 investors
          if (pool.weeks[week].length >= 7) return {};

          const investor = state.allInvestors.find(
            (inv) => inv.id === investorId
          );
          if (!investor) return {};

          const updatedWeeks = [...pool.weeks];
          updatedWeeks[week] = [...updatedWeeks[week], investor];

          return {
            pools: {
              ...state.pools,
              [poolId]: {
                ...pool,
                weeks: updatedWeeks,
              },
            },
          };
        });
      },

      updateInvestor: (poolId, week, investorId, updates) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool) return {};

          const updatedWeeks = pool.weeks.map((weekInvestors, w) =>
            w === week
              ? weekInvestors.map((inv) =>
                  inv.id === investorId ? { ...inv, ...updates } : inv
                )
              : weekInvestors
          );

          return {
            pools: {
              ...state.pools,
              [poolId]: {
                ...pool,
                weeks: updatedWeeks,
              },
            },
          };
        });
      },

      deletePool: (poolId) => {
        set((state) => {
          const newPools = { ...state.pools };
          delete newPools[poolId];
          return { pools: newPools };
        });
      },

      assignInvestorToFounder: (founderId, investorId) => {
        set((state) => ({
          founders: state.founders.map((founder) =>
            founder.id === founderId
              ? {
                  ...founder,
                  assignedInvestors: [...founder.assignedInvestors, investorId],
                }
              : founder
          ),
        }));
      },

      unassignInvestorFromFounder: (founderId, investorId) => {
        set((state) => ({
          founders: state.founders.map((founder) =>
            founder.id === founderId
              ? {
                  ...founder,
                  assignedInvestors: founder.assignedInvestors.filter(
                    (id) => id !== investorId
                  ),
                }
              : founder
          ),
        }));
      },
    }),
    {
      name: "investor-pools-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
