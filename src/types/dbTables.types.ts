export type Brand = {
  id: SupabaseBrand["id"];
  brandLogoIpfsUrl: SupabaseBrand["brand_logo_ipfs_url"];
  brandName: SupabaseBrand["brand_name"];
  collectionMetaData: SupabaseBrand["collection_metadata"];
  contractAddress: SupabaseBrand["contract_address"];
  createdAt: SupabaseBrand["created_at"];
  email: SupabaseBrand["email"];
  freeRightImageUrl: SupabaseBrand["free_right_image_url"];
  nftSrc: SupabaseBrand["nft_src"];
  ticketIpfsUrl: SupabaseBrand["ticket_ipfs_url"];
  requiredNumberForFreeRight: SupabaseBrand["required_number_for_free_right"];
};

export type BrandBranch = {
  id: SupabaseBrandBranch["id"];
  email: SupabaseBrandBranch["email"];
  brandId: SupabaseBrandBranch["brand_id"];
  branchName: SupabaseBrandBranch["branch_name"];
  campaigns: SupabaseBrandBranch["campaigns"];
  coords: SupabaseBrandBranch["coords"];
  dailyTotalOrders: SupabaseBrandBranch["daily_total_orders"];
  dailyTotalUsedFreeRights: SupabaseBrandBranch["daily_total_used_free_rights"];
  monthlyTotalOrders: SupabaseBrandBranch["monthly_total_orders"];
  totalOrders: SupabaseBrandBranch["total_orders"];
  totalUsedFreeRights: SupabaseBrandBranch["total_used_free_rights"];
  videoUrl: SupabaseBrandBranch["video_url"];
  totalUnusedFreeRights: SupabaseBrandBranch["total_unused_free_rights"];
  monthlyTotalOrdersWithYears: SupabaseBrandBranch["monthly_total_orders_with_years"];
  weeklyTotalOrders: SupabaseBrandBranch["weekly_total_orders"];
};

export type User = {
  id: SupabaseUser["id"];
  lastLogin: SupabaseUser["last_login"];
  username: SupabaseUser["username"];
  walletAddr: SupabaseUser["wallet_addr"];
};

export type UserOrder = {
  id: SupabaseUserOrders["id"];
  createdAt: SupabaseUserOrders["created_at"];
  lastOrderDate: SupabaseUserOrders["last_order_date"];
  totalTicketOrders: SupabaseUserOrders["total_ticket_orders"];
  totalUserOrders: SupabaseUserOrders["total_user_orders"];
  userId: SupabaseUserOrders["user_id"];
  userTotalFreeRights: SupabaseUserOrders["user_total_free_rights"];
  userTotalUsedFreeRights: SupabaseUserOrders["user_total_used_free_rights"];
};

export type BrandBranchDetails = {
  id: SupabaseBrandBranch["id"];
  branchName: SupabaseBrandBranch["branch_name"];
  coords: {
    lat: number;
    long: number;
  };
  campaigns: SupabaseBrandBranch["campaigns"];
  videoUrl: SupabaseBrandBranch["video_url"];
  brandId: SupabaseBrand["id"];
  brandName: SupabaseBrand["brand_name"];
  brandLogoIpfsUrl: SupabaseBrand["brand_logo_ipfs_url"];
  ticketIpfsUrl: SupabaseBrand["ticket_ipfs_url"];
  nftSrc: SupabaseBrand["nft_src"];
  contractAddress: SupabaseBrand["contract_address"];
  requiredNumberForFreeRight: SupabaseBrand["required_number_for_free_right"];
  freeRightImageUrl: SupabaseBrand["free_right_image_url"];
};
