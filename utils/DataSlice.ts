import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Role = "USER" | "ADMIN" | "REPORTED_MANAGER" | "MEMBER";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role?: Role;
  createdAt: Date;
  organizations: Organization[];
  orgMember?: OrgMember;
  reportManager?: ReportManager;
}

export interface Organization {
  id: string;
  userId: string;
  user: User;
  organizationName: string;
  industryType: string;
  organizationDiscription: string;
  orgMembers: OrgMember[];
  createdAt: Date;
}

export interface OrgMember {
  id: string;
  organizationId: string;
  userId: string;
  organization: Organization;
  user: User;
  reportManagerId?: string;
  reportManager?: ReportManager;
  createdAt: Date;
}

export interface leaveTypes {
  id: string;
  type: string;
  organizationId: string;
  leaveInYear: number;
  leaveInMonth?: number;
  colorCode: string;
  leaveDiscription: string;
}
export interface leaves {
  id: string;
  LeaveTypes: string;
  Day: Day;
  StartDateTime: Date;
  EndDateTime: Date;
  UserId: string;
  OrganizationId: string;
  reportManagerId: string;
  approvedStatus: ApprovedStatus;
  applyDate: Date;
}

export interface ReportManager {
  id: string;
  organizationId: string;
  orgMemberId: string;
  userId: string;
  user: User;
  members: OrgMember[];
}

const initialState = {
  userInfo: {} as User,
  organization: {} as Organization,
  orgMembers: [] as OrgMember[],
  isFetch: false as boolean,
  leaveTypes: [] as leaveTypes[],
  reportManagers: [] as ReportManager[],
  leaves: [] as leaves[],
};

enum Day {
  fullDay,
  HalfDay,
}
enum ApprovedStatus {
  Approved,
  Reject,
  Pending,
}

const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
    },
    setOrganization: (state, action: PayloadAction<Organization>) => {
      state.organization = action.payload;
    },
    setOrgMembers: (state, action: PayloadAction<OrgMember[]>) => {
      state.orgMembers = action.payload;
    },
    setLeaveTypes: (state, action: PayloadAction<leaveTypes[]>) => {
      state.leaveTypes = action.payload;
    },
    setReportManagers: (state, action: PayloadAction<ReportManager[]>) => {
      state.reportManagers = action.payload;
    },
    setLeaves: (state, action: PayloadAction<leaves[]>) => {
      state.leaves = action.payload;
    },
    removeReportManager: (state, action: PayloadAction<string>) => {
      state.reportManagers = state.reportManagers.filter(
        (manager: ReportManager) => manager.id !== action.payload
      );
    },
    setIsFetch: (state) => {
      state.isFetch = !state.isFetch;
    },
    removeState: () => {
      return initialState;
    },
  },
});
export const {
  setUserInfo,
  setOrganization,
  setOrgMembers,
  setIsFetch,
  setLeaveTypes,
  setReportManagers,
  setLeaves,
  removeReportManager,
  removeState,
} = dataSlice.actions;
export default dataSlice.reducer;
