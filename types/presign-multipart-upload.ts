export type PreviewFileRequest = {
  key: string;
};

export type PreviewFileResponse = {
  url: string;
}

export type DownloadFileResponse = {
  url: string;
}

export type PresignedPart = {
  partNumber: number;
  uploadUrl: string;
};

export type StartResponse = {
  key: string;
  uploadId: string;
  chunkSize: number;
  partCount: number;
  parts: PresignedPart[];
};

export type CompletedPart = {
  partNumber: number;
  eTag: string;
};

export type CompleteResponse = {
  key: string;
  eTag: string;
};

export type UploadProgressCallback = (percentage: number) => void;