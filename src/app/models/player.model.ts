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
  name?: string;
  notes?: string;
  position?: string;
  emailAddress?: string;
  jerseyFeePaid?: boolean;
}

export interface FlatPlayer {
  id?: string;
  createdTime?: Date;
  HomeAddress?: string;
  Name?: string;
  Notes?: string;
  Position?: string;
  EmailAddress?: string;
  JerseyFeePaid?: boolean;
}