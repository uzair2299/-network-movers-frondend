export interface MoveStatus {
  id: string;
  code: string;
  name: string;
  phaseCode: string;
  colorCode: string;
  customerVisible: boolean;
  internalOnly: boolean;
  x?: number;
  y?: number;
}

export interface MoveStatusTransition {
  id?: string;
  fromStatusId: string;
  toStatusId: string;
  transitionName: string;
  allowedRoleId?: string;
  requiresApproval: boolean;
  customerVisible: boolean;
  active: boolean;
}
