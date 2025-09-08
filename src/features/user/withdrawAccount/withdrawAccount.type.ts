export type withdrawalBodyType = {
  withdrawalReasons: string[];
  detailedReason: string;
};

export type withdrawalResponseType = {
  userId: string;
  withdrawnAt: string;
};
