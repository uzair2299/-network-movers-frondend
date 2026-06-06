export interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  profilePictureUrl?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  roles: string[];
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
  profilePictureUrl?: string;
}

export interface UserPayload {
  username: string;
  email: string;
  password?: string;
  enabled: boolean;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  address?: string;
}

