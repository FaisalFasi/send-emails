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
