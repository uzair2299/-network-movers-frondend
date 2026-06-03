export interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
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
}
