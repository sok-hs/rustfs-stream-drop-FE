import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {isDataView} from "node:util/types";

export default function FileUpload() {

    // URL
    const presignedUploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/s3/presign/upload`;
    const presignedPreviewUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/s3/presign/preview`;
    const saveProfileURL = `${process.env.NEXT_PUBLIC_API_URL}/api/user`;

    const [file, setFile] = useState<File | null>(null);
    const [username, setUsername] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadKey, setUploadKey] = useState<string | null>(null);
    const [img, setImg] = useState("");

    function validateError(msg: string) {
        alert(msg);
        return;
    }

    const handleClickUpload = async () => {

        if (!file) return;

        try {
            setUploading(true);

            const presignResponse = await fetch(
                presignedUploadUrl,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        filename: file.name,
                    })
                }
            );

            if (!presignResponse.ok) {
                throw new Error("Failed to create presigned URL");
            }

            const { uploadUrl, key } = await presignResponse.json();

            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload Failed");
            }

            setImg(uploadResponse.url);
            setUploadKey(key);

            alert("key: " + key);
            console.log("Uploaded: " + key);
        } catch (error) {
            console.error(error);
            alert("Upload Failed");
        } finally {
            setUploading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (username === null && username == "") validateError("Username is null");
        if (!file) return;

        try {
            setUploading(true);

            // request presign url
            const presignResponse = await fetch(
                presignedUploadUrl,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        filename: file.name,
                        size: file.size
                    })
                }
            );
            if (!presignResponse.ok) {
                throw new Error("Failed to create presigned URL");
            }

            // upload file by presign url
            const { uploadUrl, key } = await presignResponse.json();
            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file
            });
            if (!uploadResponse.ok) {
                throw new Error("Upload Failed");
            }

            setImg(uploadResponse.url);
            setUploadKey(key);


            console.log("Uploaded: " + key);

            // request presign preview url
            const preparedPresignPreviewURL = `${presignedPreviewUrl}?key=${key}`;
            console.log(preparedPresignPreviewURL);
            const previewResponse = await fetch(preparedPresignPreviewURL);
            const data = await previewResponse.json();
            console.log(data.url);

            // save user profile
            const saveProfileResponse = await fetch(
                saveProfileURL, {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        key: key
                    })
                }
            );
            if (!saveProfileResponse.ok) {
                throw new Error("Failed to create User Profile");
            }
            const saveProfileData = saveProfileResponse.json();
            console.log("Saved User Profile: " + saveProfileData);

        } catch (error) {
            console.error(error);
            alert("Upload Failed");
        } finally {
            setUploading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Field>
                        <FieldLabel htmlFor="name">Username</FieldLabel>
                        <Input id="name" type="text" placeholder="Enter your name" onChange={(e) => {
                            const username = e.target.value;
                            if (username) setUsername(username);
                        }} />
                    </Field>
                </div>

                <div className="grid gap-2">
                    <Field>
                        <FieldLabel htmlFor="picture">Profile</FieldLabel>
                        <FieldDescription>Expect: JPG, PNG, JPEG only.</FieldDescription>
                        <Input id="file" type="file" onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (selectedFile) setFile(selectedFile);
                        }} />
                        <FieldDescription>File size: 0</FieldDescription>
                    </Field>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    // onClick={handleClickUpload}
                >
                    {uploading ? "Uploading" : "Upload"}
                </Button>
            </div>
        </form>
    );
}