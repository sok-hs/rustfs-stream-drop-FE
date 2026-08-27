"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonGroup } from "@/components/ui/button-group";
import { useRouter } from "next/navigation";
import Link from "next/link";

const users = [
  {
    id: 1,
    name: "su",
    key: 123111,
  },
  {
    id: 2,
    name: "li",
    key: 123222,
  },
  {
    id: 3,
    name: "Mei",
    key: 123333,
  },
];

export default function Home() {
  return (
    <div className="flex flex-wrap min-h-screen items-center justify-center gap-2 md:flex-row mt-2">
      <CardUpload />
    </div>
  );
}

function CardUpload() {
  const router = useRouter();

  const handleGoToPresignUpload = () => {
    router.push("/presign-upload");
  };

  const handleGoToPresignMultipartUpload = () => {
    router.push("/presign-multipart-upload");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className={"justify-center"}>
        <CardTitle>User Profiles</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Button variant={"default"} onClick={handleGoToPresignUpload}>
            Go to Presign Upload
          </Button>
        </div>
        <div>
          <Button variant={"default"} onClick={handleGoToPresignMultipartUpload}>
            Go to Presign Multipart Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
