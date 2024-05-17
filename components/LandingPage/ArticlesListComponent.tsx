"use client"
import Article from '../Article'
import { PostWithCategory } from '@/types'
import { usePosts } from "@/hook/usePosts";
import PageTitle from '../PageTitle';
import { useRouter } from 'next/navigation';


type Props = {
  slug: string
}

const ArticlesListComponent = ({ slug }: Props) => {
  const { data: posts, isFetching, error } = usePosts(slug && slug);
  const router = useRouter()

  // if (posts && posts?.length === 0 ) {
  //   router.push("/not-found") 
  // }

  return (

    <>
    <PageTitle title={slug} />
      <section className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-col-5'>
        {posts?.map((post: PostWithCategory) => (
          <Article
            key={post.id}
            post={post}
          />
        ))}
      </section>
    </>
  )
}

export default ArticlesListComponent