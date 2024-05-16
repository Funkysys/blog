type Props = {
    params: {
        slug: string;
    }
}

const CategoriesPage = ({ params }: Props) => {
    const {slug} = params;
    return (
        <h2>Categories {slug}</h2>
    )
}

export default CategoriesPage