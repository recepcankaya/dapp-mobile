import { create } from "zustand";

export type BrandBranchesDetailsProps = {
  totalOrders: number;
  totalUsedFreeRights: number;
  totalUnusedFreeRights: number;
  dailyTotalOrders: number;
  dailyTotalUsedFreeRights: number;
  weeklyTotalOrders: SupabaseBrandBranch["weekly_total_orders"];
  monthlyTotalOrders: number;
};

type State = {
  brandBranchesDetails: BrandBranchesDetailsProps;
};

type Action = {
  setBrandBranchesDetails: (
    brandBranchesDetails: BrandBranchesDetailsProps
  ) => void;
};

const useBrandBranchesDetailsStore = create<State & Action>((set) => ({
  brandBranchesDetails: {} as BrandBranchesDetailsProps,
  setBrandBranchesDetails: (brandBranchesDetails) =>
    set(() => ({ brandBranchesDetails })),
}));

export default useBrandBranchesDetailsStore;
