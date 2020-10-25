export type IParticipants = {
  id: string;
  name: string;
  email: string;
  group: string;
};

export type ICsvData = {
  groupName: string;
  csvIsHeader: boolean;
  csvNameField: string;
  csvEmailField: string;
  csvData: string[][];
};

export type IFilterField = {
  name?: string;
  minimum: number;
  maximum: number;
};

export type IFilterData = {
  participants: IParticipants[];
  filters: IFilterField[];
};

export type IPresentData = {
  isCriteria: boolean;
  generatedGroups: IParticipants[][];
  filters?: IFilterField[];
};

export type IApprovedGroupsData = {
  event: string;
  coordinatorEmail: string;
  finalData: IPresentData;
};

export type IEventData = {
  title: string;
  ingress: string;
  place?: string;
  date: string;
  time: string;
  description?: string;
  filters: IFilterField[];
};
export type ILoginCredentials = {
  email: string;
  password: string;
};

export type IUser = {
  id: string;
  email: string;
  name: string;
};
