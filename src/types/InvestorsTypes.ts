// types/investor.ts
export type Investor = {
  id: string;
  name: string;
  avatar: string;
  company?: string;
  contact?: string;
};

export type InvestorWeek = Investor[]; // Max 7 investors

export type InvestorPool = {
  id: string;
  name: string;
  weeks: Investor[][]; // 5 weeks × 7 investors
};

export type Founder = {
  id: string;
  name: string;
  avatar?: string;
  company?: string;
  assignedInvestors: string[]; // Array of investor IDs
};
