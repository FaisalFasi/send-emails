// types/investor.ts
export type Investor = {
  id: string;
  name: string;
  avatar: string;
  company?: string;
  contact?: string;
};

export type Founder = {
  id: string;
  name: string;
  avatar?: string;
};

export type InvestorWeek = {
  weekNumber: number;
  investors: Investor[]; // Max 7 investors
};

export type InvestorPool = {
  id: string;
  name: string;
  weeks: InvestorWeek[];
  assignedFounders: string[]; // Founder IDs
};

export type PoolStore = {
  // record is a key-value pair
  pools: Record<string, InvestorPool>;
  founders: Founder[];
  allInvestors: Investor[];

  // Pool Management
  fetchPools: () => void;
  createPool: (name: string, founderIds?: string[]) => string;
  addWeek: (poolId: string) => void;
  removeWeek: (poolId: string, weekNumber: number) => void;
  deletePool: (poolId: string) => void;

  // Investor Assignment
  addToPool: (poolId: string, weekIndex: number, investorId: string) => void;
  updateInvestor: (
    poolId: string,
    weekIndex: number,
    investorId: string,
    updates: Partial<Investor>
  ) => void;

  // Founder Assignment
  assignFounderToPool: (poolId: string, founderId: string) => void;
  removeFounderFromPool: (poolId: string, founderId: string) => void;

  // Initialization
  initialize: () => void;
};
