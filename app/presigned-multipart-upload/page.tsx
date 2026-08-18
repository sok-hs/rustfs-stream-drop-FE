"use client";

import {Card, CardHeader, CardContent, CardTitle, CardFooter} from "@/components/ui/card";
import {Label} from "@/components/ui/label";

export default function PresignedMultipartUpload() {
    return (
        <div className={"flex flex-wrap min-h-screen items-center justify-center gap-2 md:flex-row mt-2"}>
            <Card className={"w-full max-w-sm"}>
                <CardHeader className={"justify-center"}>
                    <CardTitle>Presign S3 Multipart Upload to RustFS</CardTitle>
                </CardHeader>
                <CardContent>
                    {/*<PresignedMultipartUpload />*/}
                </CardContent>
                <CardFooter className={"flex-col gap-2"}>
                    <Label>Nothing</Label>
                </CardFooter>
            </Card>
        </div>
    );
}