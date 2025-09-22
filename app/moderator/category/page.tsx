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
import { useMemo, useState } from "react";
import { BounceLoader } from "react-spinners";

const CreateCategory = () => {
  const [data, setData] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  // Filtrer les catégories selon la saisie
  const filteredCategories = useMemo(() => {
    if (!title || !categories) return [];
    return categories.filter((cat: Category) =>
      cat.title.toLowerCase().includes(title.toLowerCase())
    );
  }, [title, categories]);

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
    setTitle(value);
    if (value !== "") {
      setSlug(slugify(value));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (categoryTitle: string) => {
    setTitle(categoryTitle);
    setSlug(slugify(categoryTitle));
    setShowSuggestions(false);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !slug) {
      return alert("Title and slug are required");
    }

    // Vérifier si la catégorie existe déjà
    const existingCategory = categories?.find(
      (cat: Category) => cat.title.toLowerCase() === title.toLowerCase()
    );

    if (existingCategory) {
      return alert("Cette catégorie existe déjà!");
    }

    const data = await axios.post("/api/categories", { title, slug });

    if (data) {
      refetch();
      setData(true);
      setTitle("");
      setSlug("");
      setShowSuggestions(false);
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

  return (
    <main className="flex flex-col justify-center items-center min-h-[80vh] gap-14">
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
            <div className="flex gap-4 mt-4 w-full justify-center">
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

      <form onSubmit={handleOnSubmit} className="flex flex-col gap-10 relative">
        <div className="relative">
          <Label htmlFor="title">Title</Label>
          <Input
            value={title}
            onChange={(e) => handleOnchange(e)}
            onFocus={() => title && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            type="text"
            id="title"
            autoComplete="off"
          />

          {/* Suggestions dropdown */}
          {showSuggestions && filteredCategories.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredCategories.map((cat: Category) => (
                <div
                  key={cat.id}
                  onClick={() => handleSuggestionClick(cat.title)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black border-b border-gray-100 last:border-b-0"
                >
                  <span className="font-medium">{cat.title}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({cat.slug})
                  </span>
                </div>
              ))}
              {filteredCategories.length > 0 && (
                <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50">
                  Catégories existantes - Cliquez pour sélectionner
                </div>
              )}
            </div>
          )}
        </div>

        <Button variant="outline" type="submit">
          Create
        </Button>
      </form>

      {user?.role === "ADMIN" && (
        <div className="w-[80%] flex flex-col justify-center items-center p-5 border-2 border-slate-600 rounded-lg">
          <h2 className="text-lg underline mb-6">Categories</h2>
          {isFetching && <p>Loading...</p>}
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2 xl:grid-cols-3 xl:gap-3 text-center">
            {categories?.map((category: Category) => (
              <div key={category.id} className="flex gap-1 mb-2 items-center">
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
