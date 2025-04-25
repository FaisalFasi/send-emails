// types/investor.ts
export type Investor = {
  id: string;
  name: string;
  avatar: string;
  company: string;
  contact?: string;
};

export type InvestorWeek = Investor[]; // Max 7 investors
export type InvestorPool = {
  id: string;
  name: string;
  weeks: InvestorWeek[]; // Exactly 5 weeks
};
