import Link from 'next/link'

const FirstTitle = () => {
    return (
        <Link href='/'>
            <h1
                className='text-2xl font-bold
            text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-green-300
            '
            >DiscoPhiles</h1>
        </Link>
    )
}

export default FirstTitle