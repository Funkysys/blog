import ArticlesListComponent from "@/components/LandingPage/ArticlesListComponent";
// import { POSTS } from '@/utils/posts'

type Props = {
  params: {
    slug: string;
  };
};

const CategoriesPage = ({ params }: Props) => {
  const { slug } = params;
  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      <section className="mb-10">
        {<ArticlesListComponent slug={slug} />}
      </section>
    </main>
  );
};

export default CategoriesPage;
