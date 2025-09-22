"use client";
import Article from "@/components/Article";
import { Button } from "@/components/ui/button";
import { usePostFromArtist } from "@/hook/usePostFromArtist";
import { PostWithCategory } from "@/types";
import { slugToArtistName } from "@/utils/formatTeam";
import { use, useState } from "react";
import { BounceLoader } from "react-spinners";
import PageTitle from "../../../components/PageTitle";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const FromArtistsPage = ({ params }: Props) => {
  const { slug } = use(params);
  const decodedSlug = decodeURIComponent(slug);
  const artistName = slugToArtistName(decodedSlug);
  const [page, setPage] = useState(0);
  const { data: posts, isFetching } = usePostFromArtist(decodedSlug);

  const nextPageFunc = () => {
    setPage((prev) => prev + 1);
  };
  const previousPageFunc = () => {
    setPage((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col justify-center">
      <PageTitle title={`Albums de ${artistName}`} />

      <div className="text-center mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{artistName}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {posts?.length || 0} collaboration{posts?.length !== 1 ? "s" : ""}{" "}
          trouvée{posts?.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="min-h-[90vh] gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-col-4">
        {isFetching ? (
          <div className="h-[90vh] flex flx-col item-center justify-center">
            <BounceLoader color="#36d7b7" />
          </div>
        ) : (
          <>
            {posts && posts.length > 0 ? (
              <>
                {posts?.map((post: PostWithCategory) => (
                  <Article key={post.id} post={post} />
                ))}
              </>
            ) : (
              <div className="h-[90vh] p-5">
                <p>Aucune collaboration trouvée pour {artistName}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="relative bottom-2 m-auto w-full flex justify-center gap-3 mt-5">
        <Button variant="outline" type="button" onClick={nextPageFunc}>
          Voir plus d&apos;albums
        </Button>
        {page > 0 && (
          <Button variant="outline" type="button" onClick={previousPageFunc}>
            Précédent
          </Button>
        )}
      </div>
    </div>
  );
};

export default FromArtistsPage;
