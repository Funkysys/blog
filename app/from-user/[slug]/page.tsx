"use client";
import Article from "@/components/Article";
import { Button } from "@/components/ui/button";
import { usePostFromUser } from "@/hook/usePostFromUser";
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

const POSTS_PER_PAGE = 12;

const FromUserPage = ({ params }: Props) => {
  const { slug } = use(params);
  const decodedSlug = decodeURIComponent(slug);
  const userName = slugToArtistName(decodedSlug);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: response, isFetching } = usePostFromUser(
    decodedSlug,
    currentPage,
    POSTS_PER_PAGE
  );

  const posts = response?.posts || [];
  const totalCount = response?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <PageTitle title={`Posts de ${userName}`} />

      <div className="text-center mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{userName}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {totalCount} post{totalCount !== 1 ? "s" : ""} trouvé
          {totalCount !== 1 ? "s" : ""}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-gray-500 mt-1">
            Page {currentPage} sur {totalPages}
          </p>
        )}
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
                {posts.map((post: PostWithCategory) => (
                  <Article key={post.id} post={post} />
                ))}
              </>
            ) : (
              <div className="h-[90vh] p-5">
                <p>Aucun post trouvé pour {userName}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 mb-4">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isFetching}
          >
            Précédent
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNum > totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={isFetching}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isFetching}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};

export default FromUserPage;
