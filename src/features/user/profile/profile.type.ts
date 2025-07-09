export type profileType = {
  nickname: string;
  profileImg: string | null;
  userNo: number;
  userId: string;
  giveTalents: number[];
  receiveTalents: number[];
};
// {
//   "userNo": 0,
//   "userId": "test@talearnt.com",
//   "profileImg": null,
//   "nickname": "",
//   "giveTalents": [],
//   "receiveTalents": [],
// }

export type activityCountsType = {
  favoritePostCount: number;
  myPostCount: number;
  myCommentCount: number;
};
// {
//   "favoritePostCount": 0,
//   "myPostCount": 0,
//   "myCommentCount": 0,
// }
