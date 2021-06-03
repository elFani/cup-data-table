export interface Roster {
  records?: Player[];
}

export interface Player {
  id?: string;
  fields?: PlayerData;
  createdTime?: Date;
}

export interface PlayerData {
  streetAddress?: string;
  Name?: string;
  notes?: string;
  position?: string;
  emailAddress?: string;
  jerseyFeePaid?: boolean;
}
