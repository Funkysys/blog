import Article from '@/components/Article';
import ArticlesListComponent from '@/components/LandingPage/ArticlesListComponent';
import PageTitle from '@/components/PageTitle';
// import { POSTS } from '@/utils/posts'

type Props = {
    params: {
        slug: string;
    }
}

const CategoriesPage = ({ params }: Props) => {
    const { slug } = params;
    return (
        <main className='w-full h-full flex flex-col justify-center items-center'>
            <PageTitle title={slug} />
            <section className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-col-5 mb-10'>
                {<ArticlesListComponent slug={slug} />}
            </section>
        </main>
    )
}

export default CategoriesPage