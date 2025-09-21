import ArticlesListComponent from "@/components/LandingPage/ArticlesListComponent";
import { use } from "react";
// import { POSTS } from '@/utils/posts'

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const CategoriesPage = ({ params }: Props) => {
  const { slug } = use(params);
  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      <section className="mb-10">
        {<ArticlesListComponent slug={slug} />}
      </section>
    </main>
  );
};

export default CategoriesPage;
