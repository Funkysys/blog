"use client";
import { usePosts } from "@/hook/usePosts";
import { PostWithCategory } from "@/types";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import Article from "../Article";
import PageTitle from "../PageTitle";
import { Button } from "../ui/button";

type Props = {
  slug: string;
};

const ArticlesListComponent = ({ slug }: Props) => {
  const [page, setPage] = useState(0);
  const { data: postsAndCount, isFetching } = usePosts(slug && slug, page);

  const nextPageFunc = () => {
    setPage((prev) => prev + 1);
    // refetch();
  };
  const previousPageFunc = () => {
    setPage((prev) => prev - 1);
    // refetch();
  };

  return (
    <div className="flex flex-col justify-center">
      <PageTitle title={slug} />

      <div className="min-h-[90vh] gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-col-4">
        {isFetching ? (
          <div className="h-[70vh] w-[70vw] flex item-center justify-center">
            <BounceLoader color="#36d7b7" className="m-auto" />
          </div>
        ) : (
          <>
            {postsAndCount.posts.length > 0 ? (
              <>
                {postsAndCount.posts?.map((post: PostWithCategory) => (
                  <Article key={post.id} post={post} />
                ))}
              </>
            ) : (
              <div className="h-[90vh] p-5">
                <p>No posts found</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className=" relative bottom-2 m-auto w-full flex justify-center gap-3 mt-5">
        {page > 0 && (
          <Button variant="outline" type="button" onClick={previousPageFunc}>
            Previous
          </Button>
        )}
        {Math.round(postsAndCount?.count / 6) - 1 > page && (
          <Button variant="outline" type="button" onClick={nextPageFunc}>
            Next ALbums
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArticlesListComponent;
