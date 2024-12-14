import Link from "next/link";
import { Button } from "../ui/button";

export function SignIn() {
  return (
    <Button type="submit" asChild>
      <Link href="/login">Sign in</Link>
    </Button>
  );
}
