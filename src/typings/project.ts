import { ResponseType } from '@/typings/api';

export interface SystemUser {
  id: number;
  username: string;
  name: string;
  dataScope: string;
  roleId: number[];
}

export interface SystemCompany {
  id: number;
  name: string;
}

export interface CurrentUser {
  userId: number;
  username: string;
  name: string;
  dataScope: string;
  roleId: number[];
  companyId: number;
  companyName: string;
}

export interface CurrentCompany {
  id: number;
  name: string;
}

export interface Authority {
  id: number;
  electronicSignatureIdentifier: number;
  signatureRemarksIdentifier: number;
}

export interface ESignParams {
  caseName?: string;
  caseObject?: string;
  authorityId: number;
  callback: (signature?: number) => void;
  onShow?: () => void;
  onCancel?: () => void;
}

export interface Service {
  (...args: any[]): Promise<ResponseType<Record<string, any>>>;
}
