// stores/usePoolStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PoolStore } from "@/types/InvestorsTypes";
import { foundersData } from "@/lib/foundersData";

export const usePoolStore = create<PoolStore>()(
  persist(
    (set, get) => ({
      pools: {},
      founders: foundersData,
      allInvestors: [],

      initialize: async () => {
        // if (get().allInvestors.length > 0) return;
        try {
          const response = await fetch("/api/investors");
          const data = await response.json();
          console.log("Fetched investors:", data);
          if (Array.isArray(data)) {
            set({ allInvestors: data });
          } else {
            console.error("Invalid data format", data);
          }

          set({
            allInvestors: data?.map((investor: any, index: number) => ({
              id: investor?.id,
              name: investor?.firstName + ` ` + investor.lastName || "Unknown",
              avatar:
                investor?.avatar || `https://i.pravatar.cc/150?img=${index}`,
              company: investor?.company || "Unknown",
              contact: investor?.contact || undefined,
            })),
          });
        } catch (error) {
          set({
            allInvestors: Array.from({ length: 50 }, (_, i) => ({
              id: `inv-${i}`,
              name: `Investor ${i}`,
              avatar: `https://i.pravatar.cc/150?img=${i}`,
              company: `Company ${i % 10}`,
              contact: i % 3 === 0 ? undefined : `contact${i}@example.com`,
            })),
          });
          console.error("Failed to fetch investors", error);
        }
      },

      createPool: (name: string, founderIds: string[] = []) => {
        const poolId = Date.now().toString();
        set((state) => ({
          pools: {
            ...state.pools,
            [poolId]: {
              id: poolId,
              name,
              weeks: [{ weekNumber: 1, investors: [] }],
              assignedFounders: [...founderIds],
            },
          },
        }));
        return poolId;
      },

      addWeek: (poolId) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool || pool.weeks.length >= 5) return {};

          const newWeekNumber = pool.weeks.length + 1;
          const updatedWeeks = [
            ...pool.weeks,
            { weekNumber: newWeekNumber, investors: [] },
          ];

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

      removeWeek: (poolId, weekNumber) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool || pool.weeks.length <= 1) return {};

          const updatedWeeks = pool.weeks.filter(
            (week) => week.weekNumber !== weekNumber
          );

          // Re-number weeks after deletion
          const renumberedWeeks = updatedWeeks.map((week, index) => ({
            ...week,
            weekNumber: index + 1,
          }));

          return {
            pools: {
              ...state.pools,
              [poolId]: {
                ...pool,
                weeks: renumberedWeeks,
              },
            },
          };
        });
      },

      addToPool: (poolId, weekIndex, investorId) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool || weekIndex < 0 || weekIndex >= pool.weeks.length)
            return {};

          // Check if investor exists in any week of this pool
          const investorExists = pool.weeks.some((week) =>
            week.investors.some((inv) => inv.id === investorId)
          );
          if (investorExists) return {};

          // Check if week has space (<7 investors)
          if (pool.weeks[weekIndex].investors.length >= 7) return {};

          const investor = state.allInvestors.find(
            (inv) => inv.id === investorId
          );
          if (!investor) return {};

          const updatedWeeks = [...pool.weeks];
          updatedWeeks[weekIndex] = {
            ...updatedWeeks[weekIndex],
            investors: [...updatedWeeks[weekIndex].investors, investor],
          };

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

      updateInvestor: (poolId, weekIndex, investorId, updates) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool || weekIndex < 0 || weekIndex >= pool.weeks.length)
            return {};

          const updatedWeeks = pool.weeks.map((week, idx) => {
            if (idx !== weekIndex) return week;

            return {
              ...week,
              investors: week.investors.map((inv) =>
                inv.id === investorId ? { ...inv, ...updates } : inv
              ),
            };
          });

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

      deletePool: (poolId: string) => {
        set((state) => {
          const newPools = { ...state.pools };
          delete newPools[poolId];
          return { pools: newPools };
        });
      },

      assignFounderToPool: (poolId: string, founderId: string) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool || pool.assignedFounders.includes(founderId)) return {};
          return {
            pools: {
              ...state.pools,
              [poolId]: {
                ...pool,
                assignedFounders: [...pool.assignedFounders, founderId],
              },
            },
          };
        });
      },

      removeFounderFromPool: (poolId: string, founderId: string) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool) return {};
          return {
            pools: {
              ...state.pools,
              [poolId]: {
                ...pool,
                assignedFounders: pool.assignedFounders.filter(
                  (id) => id !== founderId
                ),
              },
            },
          };
        });
      },
    }),
    {
      name: "investor-pools-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        pools: state.pools,
        founders: state.founders,
        allInvestors: state.allInvestors,
      }),
    }
  )
);
