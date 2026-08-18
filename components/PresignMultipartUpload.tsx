import {Field, FieldDescription, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function PresignMultipartUpload() {
    return (
        <form>
            <div className={"flex flex-col gap-6"}>
                <div className={"grid gap-2"}>
                    <Field>
                        <FieldLabel htmlFor={"name"}>Username</FieldLabel>
                        <Input type={"text"} id={"name"} placeholder={"Enter your name"} ></Input>
                    </Field>
                </div>

                <div className={"grid gap-2"}>
                    <Field>
                        <FieldLabel htmlFor={"file"}>File</FieldLabel>
                        <FieldDescription>Expect: PDF</FieldDescription>
                    </Field>
                </div>

                <div className={"grid gap-2"}>
                    <Button type={"submit"} className={"w-full"}>Upload</Button>
                </div>
            </div>
        </form>
    );
}