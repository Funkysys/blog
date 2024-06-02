import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export type UpdateButtonProps = { slug: string };

export const UpdateButton = ({ slug }: UpdateButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      className="bg-amber-400 hover:bg-amber-800 text-black"
      onClick={() => router.push(`/write/update/${slug}`)}
    >
      Update
    </Button>
  );
};
