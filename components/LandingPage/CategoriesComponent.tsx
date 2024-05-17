"use client"
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useCategories } from "@/hook/useCategories";
import { Category } from '@/types';

const CategoriesComponent = () => {
    const {data: categories} = useCategories();
    return (
        <section className='gap-4 my-6 md:my-10 flex flex-col md:flex-row justify-center items-center border-t border-b py-4'>
            {
                categories?.map((category: Category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                    >
                        <Button
                            variant="outline"
                            className='py-4'
                        >
                            {category.title}
                        </Button>
                    </Link>
                ))
            }
        </section>
    )
}

export default CategoriesComponent