"use client";

import { deleteCategory } from "@/app/api/categories/deleteCat.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hook/useCategories";
import { slugify } from "@/utils/slugify";
import { Category, User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BounceLoader } from "react-spinners";

const CreateCategory = () => {
  const [data, setData] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>();
  const [category, setCategory] = useState<Category>();
  const [deleteCat, setDeleteCat] = useState(false);
  const [deleteId, setDeleteId] = useState<string>();
  const [deleteValidation, setDeleteValidation] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    const { data } = await axios.get(`/api/user/${session?.user?.email}`);
    setUser(data);
  };
  const { data: categories, isFetching, refetch } = useCategories();

  if (status === "authenticated" && !user) {
    fetchUser();
  }

  if (status === "loading") {
    return (
      <div>
        <BounceLoader color="#36d7b7" />
      </div>
    );
  }
  if (status === "unauthenticated") {
    router.push("/login");
    return (
      <div>
        <p>You need to login to access this page</p>
      </div>
    );
  }
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
      refetch();
      setData(true);
      setTitle("");
      setSlug("");
    }
  };
  const handleOnDelete = async (category: Category) => {
    setDeleteCat(true);
    setCategory(category);
    setDeleteId(category.id);
  };
  const handleOnDeleteCategory = async () => {
    if (deleteId) {
      const deleteQuery = await deleteCategory(deleteId);
      if (deleteQuery) {
        setDeleteValidation(true);
        refetch();
        setTimeout(() => {
          setDeleteCat(false);
        }, 3000);
      }
    }
  };

  console.log(deleteValidation);
  return (
    <main className="flex flex-col justify-center items-center h-[80vh] gap-14">
      {deleteCat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold text-black text-center">
              Are you sure to delete {category?.title} and all its posts ?
            </h2>
            {deleteValidation && (
              <div className="w-auto bg-lime-400 p-4 m-auto rounded-md">
                <p className="text-center  text-black text-sm">
                  Category deleted successfully
                </p>
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-4 mt-4 w-full justify-center">
              <Button
                onClick={() => setDeleteCat(false)}
                variant="outline"
                className="bg-red-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleOnDeleteCategory()}
                variant="outline"
                className="bg-green-600"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
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
      {user?.role === "ADMIN" && (
        <div className="w-[80%] flex flex-col justify-center items-center p-5 border-2 border-slate-600 rounded-lg">
          <h2 className="text-lg underline mb-6">Categories</h2>
          {isFetching && <p>Loading...</p>}
          <div className="grid grid-cols-4 gap-4 text-center">
            {categories?.map((category: Category) => (
              <div key={category.id} className="flex gap-1 items-center">
                <p className="bg-blue-600 px-4 py-2 rounded-l-md">
                  {category.title}
                </p>
                <Button
                  className="bg-red-700 hover:bg-red-900 text-white rounded-l-none"
                  onClick={() => handleOnDelete(category)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default CreateCategory;
