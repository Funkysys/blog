"use client";
import Article from "@/components/Article";
import { Button } from "@/components/ui/button";
import { usePostFromUser } from "@/hook/usePostFromUser";
import { PostWithCategory } from "@/types";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import PageTitle from "../../../components/PageTitle";

type Props = {
  params: {
    slug: string;
  };
};

const FromUsersPage = ({ params }: Props) => {
  const { slug } = params;
  const [page, setPage] = useState(0);
  const { data: posts, isFetching } = usePostFromUser(slug);

  const nextPageFunc = () => {
    setPage((prev) => prev + 1);
    // refetch();
  };
  const previousPageFunc = () => {
    setPage((prev) => prev - 1);
    // refetch();
  };
  console.log(posts);

  return (
    <div className="flex flex-col justify-center ">
      <PageTitle title={slug} />

      <div className="min-hh-[90vh] gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-col-4">
        {isFetching ? (
          <div className="h-[90vh] flex flx-col item-center justify-center">
            <BounceLoader color="#36d7b7" />
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
              <>
                {posts?.map((post: PostWithCategory) => (
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
        <Button variant="outline" type="button" onClick={nextPageFunc}>
          Next ALbums
        </Button>
      </div>
    </div>
  );
};

export default FromUsersPage;
