"use client";

import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardContent, CardTitle, CardFooter} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field";
import {Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ButtonGroup} from "@/components/ui/button-group";
import {useRouter} from "next/navigation";

const users = [
    {
        id: 1,
        name: "su",
        key: 123111
    },
    {
        id: 2,
        name: "li",
        key: 123222
    },
    {
        id: 3,
        name: "Mei",
        key: 123333
    }
];

export default function Home() {
    return (
        <div className="flex flex-wrap min-h-screen items-center justify-center gap-2 md:flex-row mt-2">
            <CardUpload/>
        </div>
    );
}

function CardUpload() {
    const router = useRouter();

    function handleClickAdd() {
        router.push("/upload");
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className={"justify-center"}>
                <CardTitle>User Profiles</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="my-3">
                    <TableCaption>
                        <Button className="w-full rounded-none" variant={"default"} onClick={handleClickAdd} >Add</Button>
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Id</TableHead>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Key</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="text-center">{user.id}</TableCell>
                                <TableCell className="text-center">{user.name}</TableCell>
                                <TableCell className="text-center">{user.key}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}