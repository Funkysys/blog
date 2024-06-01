"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/utils/slugify";
import axios from "axios";
import { useState } from "react";

const CreateCategory = () => {
  const [data, setData] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value !== "") {
      setTitle(value);
      setSlug(slugify(value));
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !slug) {
      return alert("Title and slug are required");
    }
    const data = await axios.post("/api/categories", { title, slug });

    if (data) {
      setData(true);
      setTitle("");
      setSlug("");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center h-[80vh] gap-14">
      <h1 className="text-lg">Create Category</h1>
      {data && <h3>Record another category ?</h3>}
      <form onSubmit={handleOnSubmit} className="flex flex-col  gap-10">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            value={title}
            onChange={(e) => handleOnchange(e)}
            type="text"
            id="title"
          />
        </div>
        <Button variant="outline" type="submit">
          Create
        </Button>
      </form>
    </main>
  );
};

export default CreateCategory;
