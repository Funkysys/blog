"use client";
import { usePosts } from "@/hook/usePosts";
import { PostWithCategory } from "@/types";
import { useRouter } from "next/navigation";
import Article from "../Article";
import PageTitle from "../PageTitle";

type Props = {
  slug: string;
};

const ArticlesListComponent = ({ slug }: Props) => {
  const { data: posts, isFetching, error } = usePosts(slug && slug);
  const router = useRouter();

  // if (posts && posts?.length === 0 ) {
  //   router.push("/not-found")
  // }

  return (
    <>
      <PageTitle title={slug} />
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-col-4">
        {posts?.map((post: PostWithCategory) => (
          <Article key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};

export default ArticlesListComponent;
