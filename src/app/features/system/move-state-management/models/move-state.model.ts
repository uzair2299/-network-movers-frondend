export interface MovePhaseRequest {
  name: string;
  code: string;
  sequenceNo: number;
  active: boolean;
}

export interface MovePhaseResponse {
  id: string;
  name: string;
  code: string;
  active: boolean;
  sequenceNo: number;
  createdAt: string;
  updatedAt: string;
}

export interface MoveStatusRequest {
  name: string;
  code: string;
  description: string;
  sequenceNo: number;
  phaseId: string;
  isFinal: boolean;
  colorCode: string;
  customerVisible: boolean;
  internalOnly: boolean;
  active: boolean;
}

export interface MoveStatusResponse {
  id: string;
  name: string;
  code: string;
  active: boolean;
  description: string;
  sequenceNo: number;
  isFinal: boolean;
  colorCode: string;
  customerVisible: boolean;
  internalOnly: boolean;
  createdAt: string;
  updatedAt: string;
  phase: MovePhaseResponse;
}
