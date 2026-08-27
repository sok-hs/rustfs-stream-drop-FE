import { DownloadFileResponse, PreviewFileResponse } from "@/types/presign-multipart-upload";

const BASE_URL = "http://localhost:8080/api/s3";
const PRESIGN_PREVIEW_URL = `${BASE_URL}/presign/preview`;
const PRESIGN_DOWNLOAD_URL = `${BASE_URL}/presign/download`;

export async function getPresignPreviewUrl(key: string): Promise<PreviewFileResponse> {
  const res = await fetch(`${PRESIGN_PREVIEW_URL}?key=${key}`);

  if (!res.ok) {
    throw new Error("Failed to get data");
  }

  return res.json();
}

export async function getPresignDownloadUrl(key: string): Promise<DownloadFileResponse> {
  const response = await fetch(`${PRESIGN_DOWNLOAD_URL}?key=${key}`);

  if (!response.ok) {
    throw new Error("Failed to get data");
  }

  return response.json();
}
