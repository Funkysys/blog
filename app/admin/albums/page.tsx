"use client";

import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { PostWithCategory } from "@/types";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

type SortKey = "title" | "artist" | "catSlug" | "user";
type SortOrder = "asc" | "desc";

const AdminAlbumsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithCategory[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteSelectedModal, setShowDeleteSelectedModal] = useState(false);

  // Tri
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      // Vérifier le rôle admin
      axios.get(`/api/user/${session?.user?.email}`).then(({ data }) => {
        if (data.role !== "ADMIN") {
          router.push("/");
        }
      });
      // Charger tous les albums
      axios.get("/api/albums").then(({ data }) => {
        setPosts(data);
        setLoading(false);
      });
    }
  }, [status, session, router]);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    await axios.post("/api/albums/delete-many", { ids: selected });
    setPosts((prev) => prev.filter((post) => !selected.includes(post.id)));
    setSelected([]);
    setShowDeleteSelectedModal(false);
    setLoading(false);
  };

  const handleDeleteOne = async () => {
    if (!deleteId) return;
    setLoading(true);
    await axios.post("/api/albums/delete-many", { ids: [deleteId] });
    setPosts((prev) => prev.filter((post) => post.id !== deleteId));
    setDeleteId(null);
    setLoading(false);
  };

  // Fonction de tri
  const sortedPosts = [...posts].sort((a, b) => {
    let aValue: string = "";
    let bValue: string = "";
    switch (sortKey) {
      case "title":
        aValue = a.title || "";
        bValue = b.title || "";
        break;
      case "artist":
        aValue = a.artist || "";
        bValue = b.artist || "";
        break;
      case "catSlug":
        aValue = a.catSlug || "";
        bValue = b.catSlug || "";
        break;
      case "user":
        aValue = a.User?.name || "";
        bValue = b.User?.name || "";
        break;
      default:
        break;
    }
    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue, "fr", { sensitivity: "base" });
    } else {
      return bValue.localeCompare(aValue, "fr", { sensitivity: "base" });
    }
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <BounceLoader color="#36d7b7" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageTitle title="Gestion des albums" />
      <div className="flex justify-between items-center mb-6">
        <span className="font-semibold text-lg">{posts.length} albums</span>
        <Button
          variant="destructive"
          disabled={selected.length === 0}
          onClick={() => setShowDeleteSelectedModal(true)}
        >
          Supprimer la sélection ({selected.length})
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-900 text-slate-100 rounded-lg shadow">
          <thead>
            <tr>
              <th className="p-2"></th>
              <th
                className="p-2 cursor-pointer select-none"
                onClick={() => handleSort("title")}
              >
                Titre
                {sortKey === "title" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </th>
              <th
                className="p-2 cursor-pointer select-none"
                onClick={() => handleSort("artist")}
              >
                Artiste
                {sortKey === "artist" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </th>
              <th
                className="p-2 cursor-pointer select-none"
                onClick={() => handleSort("catSlug")}
              >
                Catégorie
                {sortKey === "catSlug" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </th>
              <th
                className="p-2 cursor-pointer select-none"
                onClick={() => handleSort("user")}
              >
                Utilisateur
                {sortKey === "user" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-slate-700 hover:bg-slate-800"
              >
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(post.id)}
                    onChange={() => handleSelect(post.id)}
                    className="w-5 h-5 accent-amber-500"
                  />
                </td>
                <td className="p-2 font-semibold">{post.title}</td>
                <td className="p-2">{post.artist}</td>
                <td className="p-2">{post.catSlug}</td>
                <td className="p-2">{post.User?.name}</td>
                <td className="p-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/write/update/${post.slug}`)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(post.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modale de confirmation suppression */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">
              Supprimer cet album ?
            </h2>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteOne}>
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Modale de confirmation suppression sélection */}
      {showDeleteSelectedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">
              Supprimer {selected.length} album(s) sélectionné(s) ?
            </h2>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => setShowDeleteSelectedModal(false)}
              >
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteSelected}>
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlbumsPage;
