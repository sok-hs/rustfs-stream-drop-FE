"use client";

import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardContent, CardTitle, CardFooter} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field";
import { FormEvent, useState } from "react";

export default function Upload() {
    return (
        <div className="flex flex-wrap min-h-screen items-center justify-center gap-2 md:flex-row mt-2">
            <CardUpload/>
        </div>
    );
}




function CardUpload() {

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadKey, setUploadKey] = useState<string | null>(null);
    const [img, setImg] = useState("");

    const handleClickUpload = async () => {

        if (!file) return;

        try {
            setUploading(true);

            const presignResponse = await fetch(
                "http://localhost:8080/api/s3/upload/presign",
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

            const {uploadUrl, key} = await presignResponse.json();

            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload Failed");
            }

            console.log(uploadResponse);

            setImg(uploadResponse.url);

            setUploadKey(key);

            console.log("Uploaded: " + key);
        } catch (error) {
            console.error(error);
            alert("Upload Failed");
        } finally {
            setUploading(false);
        }
    }
    
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className={"justify-center"}>
                <CardTitle>RustFS Stream Drop </CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input id="name" type="text" placeholder="Enter your name" />
                            </Field>
                        </div>

                        <div className="grid gap-2">
                            <Field>
                                <FieldLabel htmlFor="picture">File</FieldLabel>
                                <Input id="file" type="file" onChange={(e) => {
                                    const selectedFile = e.target.files?.[0];

                                    if (selectedFile) {
                                        setFile(selectedFile);
                                    }
                                }} />
                                <FieldDescription>Expect: JPG, PNG, JPEG only. </FieldDescription>
                            </Field>
                        </div>

                        <Button type="button" className="w-full" onClick={handleClickUpload}>Upload</Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Label>Resutl</Label>
                <Label>=== Key ===</Label>
                <Label>=== Link ===</Label>
                
            </CardFooter>
        </Card>
    );
}