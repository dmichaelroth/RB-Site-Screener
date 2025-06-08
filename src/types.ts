export interface User {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  isPrivate: boolean;
  memberCount: number;
  activeMembers: number;
  members: User[];
  admin: User;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  timestamp: Date;
  isCurrentUser: boolean;
}
