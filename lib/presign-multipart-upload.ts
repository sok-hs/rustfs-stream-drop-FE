import {
  CompletedPart,
  CompleteResponse,
  StartResponse,
  UploadProgressCallback,
} from "@/types/presign-multipart-upload";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const PRESIGNED_MULTIPART_UPLOAD_URL = `${API_URL}/api/presign/multipart-upload`;

const MAX_FILE_SIZE = 30 * 1024 * 1024;

function uploadPart(
  url: string,
  blob: Blob,
  onProgress?: (loaded: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(event.loaded);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const eTag = xhr.getResponseHeader("ETag");

        if (!eTag) {
          reject(new Error("RustFS did not return ETag. Check RustFS CORS ExposeHeaders"));

          return;
        }

        resolve(eTag);
        return;
      }

      reject(new Error(`Part upload failed: ${xhr.status}`));
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading part"));
    };

    xhr.onabort = () => {
      reject(new Error("Upload aborted"));
    };

    xhr.send(blob);
  });
}

async function startMultipartUpload(file: File): Promise<StartResponse> {
  const response = await fetch(`${PRESIGNED_MULTIPART_UPLOAD_URL}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      fileSize: file.size,
    }),
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(message || "Failed to start upload");
  }

  return response.json();
}

async function completeMultipartUpload(
  session: StartResponse,
  parts: CompletedPart[]
): Promise<CompleteResponse> {
  const response = await fetch(`${PRESIGNED_MULTIPART_UPLOAD_URL}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: session.key,
      uploadId: session.uploadId,
      parts,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to complete multipart upload");
  }

  return response.json();
}

async function abortMultipartUpload(session: StartResponse): Promise<void> {
  await fetch(`${PRESIGNED_MULTIPART_UPLOAD_URL}/abort`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: session.key,
      uploadId: session.uploadId,
    }),
  });
}

export async function uploadFile(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<CompleteResponse> {
  if (!file) {
    throw new Error("File not found");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Maximum file size is 30 MiB");
  }

  let session: StartResponse | undefined;

  try {
    session = await startMultipartUpload(file);

    const completedParts: CompletedPart[] = [];

    let uploadedBeforeCurrentPart = 0;

    for (const part of session.parts) {
      const start = (part.partNumber - 1) * session.chunkSize;

      const end = Math.min(start + session.chunkSize, file.size);

      const chunk = file.slice(start, end);

      const eTag = await uploadPart(part.uploadUrl, chunk, (currentPartLoaded) => {
        const totalUploaded = uploadedBeforeCurrentPart + currentPartLoaded;

        const percentage = Math.min(100, Math.round((totalUploaded / file.size) * 100));

        onProgress?.(percentage);
      });

      completedParts.push({
        partNumber: part.partNumber,
        eTag,
      });

      uploadedBeforeCurrentPart += chunk.size;
    }

    const result = await completeMultipartUpload(session, completedParts);

    onProgress?.(100);

    return result;
  } catch (error) {
    if (session) {
      try {
        await abortMultipartUpload(session);
      } catch {
        console.error("Could not abort multipart upload");
      }
    }
    throw error;
  }
}

export async function previewFile() {
  console.log("123123123");
}

export async function downloadFile() {}
