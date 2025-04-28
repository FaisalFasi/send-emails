// stores/usePoolStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PoolStore, InvestorPool } from "@/types/InvestorsTypes";
import { foundersData } from "@/lib/foundersData";

// Utility function: Update pool in Firestore
async function updatePoolInFirestore(pool: InvestorPool) {
  try {
    const res = await fetch(`/api/pools/${pool.id}`, {
      method: "PUT", // Use PUT to update
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pool),
    });
    if (!res.ok) {
      throw new Error("Failed to update pool in Firestore");
    }
    const data = await res.json();
    console.log("Pool updated in Firestore:", data);
  } catch (error) {
    console.error("Error updating pool in Firestore", error);
  }
}

export const usePoolStore = create<PoolStore>()(
  persist(
    (set, get) => ({
      pools: {},
      founders: foundersData,
      allInvestors: [],

      initialize: async () => {
        try {
          const response = await fetch("/api/investors");
          const data = await response.json();
          console.log("Fetched investors:", data);

          set({
            allInvestors: data?.map((investor: any, index: number) => ({
              id: investor?.id,
              name: investor?.firstName + ` ` + investor?.lastName || "Unknown",
              avatar:
                investor?.avatar || `https://i.pravatar.cc/150?img=${index}`,
              company: investor?.company || "Unknown",
              contact: investor?.contact || undefined,
            })),
          });
        } catch (error) {
          console.error("Failed to fetch investors", error);
        }
      },

      fetchPools: () => {
        const fetchRequest = async () => {
          try {
            const res = await fetch("/api/pools");
            if (!res.ok) {
              throw new Error("Failed to fetch pools");
            }
            const pools = await res.json();

            if (pools.length === 0) {
              console.log("No pools found in the database");
              return set({ pools: {} }); // Clear existing pools before setting new ones
            }

            console.log("Pools fetched from Firestore:", pools);
            set({ pools: pools }); // Clear existing pools before setting new ones
            return pools; // Return the pools to be used or set as default
          } catch (error) {
            console.error("Error fetching pools:", error);
            return null;
          }
        };
        fetchRequest();
      },

      createPool: (name, founderIds = []) => {
        const poolId = Date.now().toString();

        const newPool: InvestorPool = {
          id: poolId,
          name,
          weeks: [
            { weekNumber: 1, investors: [] },
            { weekNumber: 2, investors: [] },
            { weekNumber: 3, investors: [] },
            { weekNumber: 4, investors: [] },
            { weekNumber: 5, investors: [] },
          ],
          assignedFounders: [...founderIds],
        };

        set((state) => ({
          pools: { ...state.pools, [poolId]: newPool },
        }));

        const postRequest = async () => {
          try {
            const res = await fetch("/api/pools", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newPool),
            });
            if (!res.ok) throw new Error("Failed to save pool");
            const data = await res.json();
            console.log("Pool saved to Firestore:", data);
          } catch (error) {
            console.error("Failed to save pool to Firestore", error);
          }
        };
        postRequest();

        return poolId;
      },

      addWeek: (poolId) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool || pool.weeks.length >= 5) return {};

          const updatedPool = {
            ...pool,
            weeks: [
              ...pool.weeks,
              { weekNumber: pool.weeks.length + 1, investors: [] },
            ],
          };

          updatePoolInFirestore(updatedPool);

          return { pools: { ...state.pools, [poolId]: updatedPool } };
        });
      },

      removeWeek: (poolId, weekNumber) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool || pool.weeks.length <= 1) return {};

          const updatedWeeks = pool.weeks
            .filter((week) => week.weekNumber !== weekNumber)
            .map((week, index) => ({
              ...week,
              weekNumber: index + 1,
            }));

          const updatedPool = { ...pool, weeks: updatedWeeks };
          updatePoolInFirestore(updatedPool);

          return { pools: { ...state.pools, [poolId]: updatedPool } };
        });
      },

      addToPool: (poolId, weekIndex, investorId) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool || weekIndex < 0 || weekIndex >= pool.weeks.length)
            return {};

          const investorExists = pool.weeks.some((week) =>
            week.investors.some((inv) => inv.id === investorId)
          );
          if (investorExists) return {};

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

          const updatedPool = { ...pool, weeks: updatedWeeks };
          updatePoolInFirestore(updatedPool);

          return { pools: { ...state.pools, [poolId]: updatedPool } };
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

          const updatedPool = { ...pool, weeks: updatedWeeks };
          updatePoolInFirestore(updatedPool);

          return { pools: { ...state.pools, [poolId]: updatedPool } };
        });
      },

      deletePool: (poolId) => {
        set((state) => {
          const newPools = { ...state.pools };
          delete newPools[poolId];

          // Optional: Call DELETE API here if you want to also delete from Firestore

          const deleteRequest = async () => {
            try {
              console.log("Deleting pool with ID:", poolId);
              const res = await fetch(`/api/pools/${poolId}`, {
                method: "DELETE",
              });

              if (!res.ok) {
                throw new Error("Failed to delete pool");
              }

              const data = await res.json();
              console.log("Pool deleted successfully:", data);
            } catch (error) {
              console.error("Error deleting pool:", error);
            }
          };
          deleteRequest();

          return { pools: newPools };
        });
      },

      assignFounderToPool: (poolId, founderId) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool || pool.assignedFounders.includes(founderId)) return {};

          const updatedPool = {
            ...pool,
            assignedFounders: [...pool.assignedFounders, founderId],
          };
          updatePoolInFirestore(updatedPool);

          return { pools: { ...state.pools, [poolId]: updatedPool } };
        });
      },

      removeFounderFromPool: (poolId, founderId) => {
        set((state) => {
          const pool = state.pools[poolId];
          if (!pool) return {};

          const updatedPool = {
            ...pool,
            assignedFounders: pool.assignedFounders.filter(
              (id) => id !== founderId
            ),
          };
          updatePoolInFirestore(updatedPool);

          return { pools: { ...state.pools, [poolId]: updatedPool } };
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

// export const usePoolStore = create<PoolStore>()(
//   persist(
//     (set, get) => ({
//       pools: {},
//       founders: foundersData,
//       allInvestors: [],

//       initialize: async () => {
//         // if (get().allInvestors.length > 0) return;
//         try {
//           const response = await fetch("/api/investors");
//           const data = await response.json();
//           console.log("Fetched investors:", data);

//           set({
//             allInvestors: data?.map((investor: any, index: number) => ({
//               id: investor?.id,
//               name: investor?.firstName + ` ` + investor.lastName || "Unknown",
//               avatar:
//                 investor?.avatar || `https://i.pravatar.cc/150?img=${index}`,
//               company: investor?.company || "Unknown",
//               contact: investor?.contact || undefined,
//             })),
//           });
//         } catch (error) {
//           set({
//             allInvestors: Array.from({ length: 50 }, (_, i) => ({
//               id: `inv-${i}`,
//               name: `Investor ${i}`,
//               avatar: `https://i.pravatar.cc/150?img=${i}`,
//               company: `Company ${i % 10}`,
//               contact: i % 3 === 0 ? undefined : `contact${i}@example.com`,
//             })),
//           });
//           console.error("Failed to fetch investors", error);
//         }
//       },

//       createPool: (name: string, founderIds: string[] = []) => {
//         const poolId = Date.now().toString();

//         console.log("Creating pool with ID:", poolId);

//         const newPool: InvestorPool = {
//           id: poolId,
//           name,
//           weeks: [
//             { weekNumber: 1, investors: [] },
//             { weekNumber: 2, investors: [] },
//             { weekNumber: 3, investors: [] },
//             { weekNumber: 4, investors: [] },
//             { weekNumber: 5, investors: [] },
//           ],
//           assignedFounders: [...founderIds],
//         };

//         set((state) => ({
//           pools: { ...state.pools, [poolId]: newPool },
//         }));

//         const postRequest = async () => {
//           try {
//             const res = await fetch("/api/pools", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(newPool),
//             });

//             if (!res.ok) {
//               throw new Error("Failed to save pool");
//             }
//             const data = await res.json();
//             console.log("Pool saved to Firestore:", data);
//           } catch (error) {
//             console.error("Failed to save pool to Firestore", error);
//           }
//         };
//         // POST to Firestore
//         postRequest();
//         return poolId;
//       },

//       addWeek: (poolId) => {
//         set((state) => {
//           const pool = state.pools[poolId];
//           if (!pool || pool.weeks.length >= 5) return {};

//           const newWeekNumber = pool.weeks.length + 1;
//           const updatedWeeks = [
//             ...pool.weeks,
//             { weekNumber: newWeekNumber, investors: [] },
//           ];

//           return {
//             pools: {
//               ...state.pools,
//               [poolId]: {
//                 ...pool,
//                 weeks: updatedWeeks,
//               },
//             },
//           };
//         });
//       },

//       removeWeek: (poolId, weekNumber) => {
//         set((state) => {
//           const pool = state.pools[poolId];
//           if (!pool || pool.weeks.length <= 1) return {};

//           const updatedWeeks = pool.weeks.filter(
//             (week) => week.weekNumber !== weekNumber
//           );

//           // Re-number weeks after deletion
//           const renumberedWeeks = updatedWeeks.map((week, index) => ({
//             ...week,
//             weekNumber: index + 1,
//           }));

//           return {
//             pools: {
//               ...state.pools,
//               [poolId]: {
//                 ...pool,
//                 weeks: renumberedWeeks,
//               },
//             },
//           };
//         });
//       },

//       addToPool: (poolId, weekIndex, investorId) => {
//         set((state) => {
//           const pool = state.pools[poolId];
//           if (!pool || weekIndex < 0 || weekIndex >= pool.weeks.length)
//             return {};

//           // Check if investor exists in any week of this pool
//           const investorExists = pool.weeks.some((week) =>
//             week.investors.some((inv) => inv.id === investorId)
//           );
//           if (investorExists) return {};

//           // Check if week has space (<7 investors)
//           if (pool.weeks[weekIndex].investors.length >= 7) return {};

//           const investor = state.allInvestors.find(
//             (inv) => inv.id === investorId
//           );
//           if (!investor) return {};

//           const updatedWeeks = [...pool.weeks];
//           updatedWeeks[weekIndex] = {
//             ...updatedWeeks[weekIndex],
//             investors: [...updatedWeeks[weekIndex].investors, investor],
//           };

//           return {
//             pools: {
//               ...state.pools,
//               [poolId]: {
//                 ...pool,
//                 weeks: updatedWeeks,
//               },
//             },
//           };
//         });
//       },

//       updateInvestor: (poolId, weekIndex, investorId, updates) => {
//         set((state) => {
//           const pool = state.pools[poolId];
//           if (!pool || weekIndex < 0 || weekIndex >= pool.weeks.length)
//             return {};

//           const updatedWeeks = pool.weeks.map((week, idx) => {
//             if (idx !== weekIndex) return week;

//             return {
//               ...week,
//               investors: week.investors.map((inv) =>
//                 inv.id === investorId ? { ...inv, ...updates } : inv
//               ),
//             };
//           });

//           return {
//             pools: {
//               ...state.pools,
//               [poolId]: {
//                 ...pool,
//                 weeks: updatedWeeks,
//               },
//             },
//           };
//         });
//       },

//       deletePool: (poolId: string) => {
//         set((state) => {
//           const newPools = { ...state.pools };
//           delete newPools[poolId];
//           return { pools: newPools };
//         });
//       },

//       assignFounderToPool: (poolId: string, founderId: string) => {
//         set((state) => {
//           const pool = state.pools[poolId];
//           if (!pool || pool.assignedFounders.includes(founderId)) return {};
//           return {
//             pools: {
//               ...state.pools,
//               [poolId]: {
//                 ...pool,
//                 assignedFounders: [...pool.assignedFounders, founderId],
//               },
//             },
//           };
//         });
//       },

//       removeFounderFromPool: (poolId: string, founderId: string) => {
//         set((state) => {
//           const pool = state.pools[poolId];
//           if (!pool) return {};
//           return {
//             pools: {
//               ...state.pools,
//               [poolId]: {
//                 ...pool,
//                 assignedFounders: pool.assignedFounders.filter(
//                   (id) => id !== founderId
//                 ),
//               },
//             },
//           };
//         });
//       },
//     }),
//     {
//       name: "investor-pools-storage",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         pools: state.pools,
//         founders: state.founders,
//         allInvestors: state.allInvestors,
//       }),
//     }
//   )
// );
