"use client";

import {Card, CardHeader, CardContent, CardTitle, CardFooter} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import FileUpload from "@/components/FileUpload";

export default function Upload() {
    return (
        <div className="flex flex-wrap min-h-screen items-center justify-center gap-2 md:flex-row mt-2">
            <CardUpload/>
        </div>
    );
}

function CardUpload() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className={"justify-center"}>
                <CardTitle>RustFS Upload</CardTitle>
            </CardHeader>
            <CardContent>
                <FileUpload />
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Label>Resutl:</Label>
                <Label>=== Key ===</Label>
                <Label>=== Link ===</Label>
            </CardFooter>
        </Card>
    );
}