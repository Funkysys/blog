"use client"
import Article from '../Article'
import { Post } from '@/types'
import { usePosts } from "@/hook/usePosts";


type Props = {
  slug: string
}

const ArticlesListComponent = ({slug}: Props) => {
  const {data: posts, isFetching} = usePosts(slug && slug);

  return (
    <section className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-col-5'>
      {posts?.map((post: Post) => (
        <Article 
          key={post.id}
          post={post}
        />
      ))}
    </section>
  )
}

export default ArticlesListComponent