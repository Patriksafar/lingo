import { addNewProject } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateProjectDialog() {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Start with creating your fist project.
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            "use server";
            await addNewProject(formData);
          }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="name" className="sr-only">
                Name
              </Label>
              <Input id="name" name="name" />
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
