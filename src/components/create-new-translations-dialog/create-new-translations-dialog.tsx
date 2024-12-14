"use client";

import { addNewTranslation } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Textarea } from "../ui/textarea";
import { useProjects } from "../project-provider";

export function CreateNewTranslationsDialog() {
  const { activeProject } = useProjects();
  const addNewTranslationWithId = addNewTranslation.bind(
    null,
    activeProject?.id ?? "",
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new translation</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await addNewTranslationWithId(formData);
          }}
        >
          <div className="flex flex-col items-center space-y-2 mb-2">
            <div className="grid w-full gap-2">
              <Label htmlFor="key" className="">
                Key
              </Label>
              <Input id="key" name="key" placeholder="Your translation key" />
            </div>
            <div className="grid w-full flex-1 gap-2">
              <Label htmlFor="en" className="">
                English
              </Label>
              <Textarea id="en" name="en" placeholder="English translation" />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="submit" variant="default">
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
