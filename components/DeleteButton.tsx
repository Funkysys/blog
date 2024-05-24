import { deletePost } from "@/app/api/posts/[slug]/deletePost.action";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "./ui/button";

export type DeleteButtonProps = {
  id: string;
};

export const DeleteButton = (props: DeleteButtonProps) => {
  const { id } = props;
  const [isDelete, setIsDelete] = useState(false);
  const router = useRouter();

  const handleOnDelete = async () => {
    setIsDelete(false);
    const deleted = await deletePost(id);
    if (deleted) {
      router.push("/");
    }
    setIsDelete(true);
  };

  return (
    <Button
      variant={"destructive"}
      className="bg-red-400"
      onClick={handleOnDelete}
    >
      Delete
    </Button>
  );
};
