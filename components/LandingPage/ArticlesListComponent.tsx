"use client";
import { addAllPosts } from "@/app/api/posts/addAllPosts";
import { usePosts } from "@/hook/usePosts";
import { PostWithCategory } from "@/types";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import Article from "../Article";
import PageTitle from "../PageTitle";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
  slug: string;
};

const ArticlesListComponent = ({ slug }: Props) => {
  const [page, setPage] = useState(0);
  const [allPosts, setAllPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // État pour la recherche
  const [filteredPosts, setFilteredPosts] = useState<PostWithCategory[]>([]); // Posts filtrés
  const { data: postsAndCount, isFetching } = usePosts(slug && slug, page);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const posts = await addAllPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error("Erreur lors de la récupération des bannières :", error);
      }
    };

    fetchAllPosts();
  }, []);

  useEffect(() => {
    if (postsAndCount?.posts) {
      // Filtrer les posts en fonction de la recherche
      const filtered = postsAndCount.posts.filter(
        (post: PostWithCategory) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post?.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(post.team) &&
            post.team.some(
              (member) =>
                typeof member === "object" &&
                member !== null &&
                "name" in member &&
                typeof (member as any).name === "string" &&
                (member as any).name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            ))
      );
      setFilteredPosts(filtered);
    }
  }, [postsAndCount, searchQuery]);

  const nextPageFunc = () => {
    setPage((prev) => prev + 1);
  };
  const previousPageFunc = () => {
    setPage((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col justify-center">
      <PageTitle title={slug} />

      {/* Barre de recherche */}
      <div className="flex justify-center mb-6">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un album, un artiste ou un membre d'équipe..."
          className="w-full max-w-lg"
        />
      </div>

      <div className="min-h-[90vh] gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-col-4">
        {isFetching ? (
          <div className="h-[70vh] w-[70vw] flex item-center justify-center">
            <BounceLoader color="#36d7b7" className="m-auto" />
          </div>
        ) : (
          <>
            {filteredPosts.length > 0 ? (
              <>
                {filteredPosts.map((post: PostWithCategory) => (
                  <Article key={post.id} post={post} />
                ))}
              </>
            ) : (
              <div className="h-[90vh] p-5">
                <p>Aucun post trouvé</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className=" relative bottom-2 m-auto w-full flex justify-center gap-3 mt-5">
        {Math.round(allPosts / 6) > 0 && page > 0 && (
          <Button variant="outline" type="button" onClick={previousPageFunc}>
            Previous
          </Button>
        )}
        {Math.round(allPosts / 6) > page && (
          <Button variant="outline" type="button" onClick={nextPageFunc}>
            Next Albums
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArticlesListComponent;
