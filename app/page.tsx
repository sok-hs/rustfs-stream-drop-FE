import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardContent, CardTitle, CardAction, CardFooter} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field";

export default function Home() {
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
                <CardTitle>RustFS Stream Drop </CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Field>
                                <FieldLabel htmlFor="picture">File</FieldLabel>
                                <Input id="file" type="file"/>
                                <FieldDescription>Expect: JPG, PNG, JPEG only. </FieldDescription>
                            </Field>
                        </div>

                        <Button type="submit" className="w-full">
                            Upload
                        </Button>
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