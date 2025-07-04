import apiCommunity from "@/utils/communityApi";

// Types for dashboard data
export interface DashboardSummary {
  totalMembers: number;
  totalUsers: number;
  totalAnnualFees: number;
  totalPaidFees: number;
  totalPendingFees: number;
  totalIncome: number;
  totalExpense: number;
}

export interface LatestNews {
  newsId: string;
  title: string;
  published: boolean;
  createdAt: string;
  coverImageUrl: string;
}

export interface PendingRequirement {
  personName: string;
  requirement: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface RecentMovement {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
}

export interface MembersByNeighborhood {
  neighborhoodName: string;
  membersCount: number;
}

export interface MemberOverdueFee {
  name: string;
  amountDue: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
}

export interface UsersByRole {
  roleName: string;
  usersCount: number;
}

// Dashboard API service
export const dashboardService = {
  // Get dashboard summary
  async getSummary(): Promise<DashboardSummary> {
    const response = await apiCommunity.get('/dashboard/summary');
    return response.data;
  },

  // Get latest news
  async getLatestNews(params?: {
    limit?: number;
    dateRange?: string;
  }): Promise<LatestNews[]> {
    const response = await apiCommunity.get('/dashboard/latest-news', {
      params
    });
    return response.data;
  },

  // Get pending requirements
  async getPendingRequirements(params?: {
    limit?: number;
    dateRange?: string;
  }): Promise<PendingRequirement[]> {
    const response = await apiCommunity.get('/dashboard/pending-requirements', {
      params
    });
    return response.data;
  },

  // Get recent movements
  async getRecentMovements(params?: {
    limit?: number;
    dateRange?: string;
  }): Promise<RecentMovement[]> {
    const response = await apiCommunity.get('/dashboard/recent-movements', {
      params
    });
    return response.data;
  },

  // Get members by neighborhood
  async getMembersByNeighborhood(params?: { dateRange?: string }): Promise<MembersByNeighborhood[]> {
    const response = await apiCommunity.get('/dashboard/members-by-neighborhood', {
      params: params?.dateRange ? params : undefined,
    });
    return response.data;
  },

  // Get members with overdue fees
  async getMembersOverdueFees(params?: {
    limit?: number;
    dateRange?: string;
  }): Promise<MemberOverdueFee[]> {
    const response = await apiCommunity.get('/dashboard/members-overdue-fees', {
      params
    });
    return response.data;
  },

  // Get users by role
  async getUsersByRole(params?: { dateRange?: string }): Promise<UsersByRole[]> {
    const response = await apiCommunity.get('/dashboard/users-by-role', {
      params: params?.dateRange ? params : undefined,
    });
    return response.data;
  }
}; 