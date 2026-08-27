export type SaveUserRequest = {
  username: string;
  originalFilename: string;
  objectKey: string;
  contentType: string;
  fileSize: number;
};

export type SaveUserResponse = {
  id: number;
  username: string;
  key: string;
};
