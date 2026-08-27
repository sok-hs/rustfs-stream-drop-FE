"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/presign-multipart-upload";
import { useState } from "react";
import { getPresignPreviewUrl, getPresignDownloadUrl } from "@/lib/presign-upload";
import { ButtonGroup } from "@/components/ui/button-group";
import { toast } from "sonner";
import { SaveUserRequest } from "@/types/user";
import { saveUser } from "@/lib/user";

export default function PresignedMultipartUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  async function handleUpload() {
    if (username === "") {
      toast.warning("The Username is required !");
      return;
    }

    if (!file) {
      toast.warning("The Docs is required !");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      setMessage("");

      const result = await uploadFile(file, (percentage) => {
        setProgress(percentage);
      });

      console.log("Uploaded object:", result);

      setMessage(`Uploaded successfully: ${result.key}`);

      // Get Presign Preview URL
      const previewUrl = await getPresignPreviewUrl(result.key);
      setPreviewUrl(previewUrl.url);

      // Get Presign Download URL
      const downloadUrl = await getPresignDownloadUrl(result.key);
      setDownloadUrl(downloadUrl.url);

      // prepare data to save user
      const saveUserRequest: SaveUserRequest = {
        username: username,
        originalFilename: file.name,
        objectKey: result.key,
        contentType: file.type,
        fileSize: file.size,
      };

      const savedUser = await saveUser(saveUserRequest);
      toast.success(`The user ${savedUser.username} has been created.`);
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handlePreviewFile() {
    if (previewUrl === "") {
      toast.warning("Preview URL not found!");
      return;
    }
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  }

  function handleDownloadFile() {
    if (downloadUrl === "") {
      toast.warning("Download URL not found!");
      return;
    }
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
    toast.success("Downloaded!");
  }

  return (
    <div
      className={"flex flex-wrap min-h-screen items-center justify-center gap-2 md:flex-row mt-2"}
    >
      <Card className={"w-full max-w-sm"}>
        <CardHeader className={"justify-center"}>
          <CardTitle>Presign Multipart Upload to RustFS</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className={"flex flex-col gap-6"}>
              <div className={"grid gap-2"}>
                <Field>
                  <FieldLabel htmlFor={"name"}>Username</FieldLabel>
                  <Input
                    type={"text"}
                    id={"name"}
                    placeholder={"Enter your name"}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Field>
              </div>

              <div className={"grid gap-2"}>
                <Field>
                  <FieldLabel htmlFor={"file"}>Docs</FieldLabel>
                  <FieldDescription>Upload a Zip file (maximum 30MB)</FieldDescription>
                  <Input
                    type={"file"}
                    id={"file"}
                    disabled={uploading}
                    onChange={(event) => {
                      const selected = event.target.files?.[0];

                      if (selected) {
                        setFile(selected);
                        setProgress(0);
                        setMessage("");
                      }
                    }}
                  />
                </Field>
              </div>

              <Button
                type={"button"}
                // disabled={!file || uploading}
                onClick={handleUpload}
                className={"w-full"}
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>

              {uploading && (
                <div>
                  <progress value={progress} max={100} className="w-full" />

                  <span className="block text-center">{progress}%</span>
                </div>
              )}

              {message && <p>{message}</p>}

              <ButtonGroup className="w-full flex">
                <Button variant={"default"} className={"flex-1"} onClick={handlePreviewFile}>
                  Preview
                </Button>
                <Button variant={"default"} className="flex-1" onClick={handleDownloadFile}>
                  Download
                </Button>
              </ButtonGroup>
            </div>
          </form>
        </CardContent>
        {/*<CardFooter className={"flex-col gap-2"}>*/}
        {/*    <Label>Nothing</Label>*/}
        {/*</CardFooter>*/}
      </Card>
    </div>
  );
}
