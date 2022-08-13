import type {NextPage, GetServerSideProps} from 'next'
import Head from 'next/head'
import {Header} from "../components/Header";
import {sanityClient, urlFor} from '../sanity'
import {groq} from "next-sanity";
import {Post} from "../types";
import {useMemo} from "react";
import Link from "next/link";

interface Props {
    posts: Post[]
}

const Home: NextPage<Props> = ({posts}) => {

    const renderedPosts = useMemo(() => {
        return posts.map(post => {
            return (
                <Link key={post._id} href={`post/${post.slug}`}>
                    <div className={'bg-white border overflow-hidden rounded-lg group cursor-pointer'}>
                        <img className={'object-cover h-60 w-full group-hover:scale-105 transition-transform ease-in-out duration-200'}
                             src={urlFor(post.mainImage).url()} alt="#"/>
                        <div className={'flex flex-row items-center justify-between p-5'}>
                            <div className={'space-y-5 w-fit mr-5'}>
                                <h1 className={'font-bold text-xl'}>{post.title}</h1>
                                <span className={'text-xs'}>{post.description}</span>
                                <span className={'text-xs font-bold italic'}> by {post.author.name}</span>
                            </div>
                            <img className={'h-12 w-12 rounded-full'}
                                 src={urlFor(post.author.image).url()} alt="#"/>
                        </div>
                    </div>
                </Link>
            )
        })
    }, [posts])

    return (
        <div className={'max-w-7xl mx-auto'}>
            <Head>
                <title>Medium blog</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Header/>
            <div className={'bg-yellow-300 border-y border-black flex py-10 justify-between items-center lg:py-0'}>
                <div className={'space-y-5 max-w-2xl px-10'}>
                    <h1 className={'text-7xl font-serif'}>
                        <span className={'underline decoration-4 decoration-black'}>Medium</span>{' '}
                        is place to read, write, and connect
                    </h1>
                    <h2>
                        It's easy and free to post your thinking on any topic
                        and connect with millions of readers.
                    </h2>
                </div>
                <img className={'hidden md:inline-flex h-32 lg:h-full'}
                     src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
                     alt="#"/>
            </div>
            <div className={'grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 md:gap-6 p-2 md:p-6'}>
                {renderedPosts}
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const queryPosts = groq`*[_type == "post"]{
      _id,
      title,
      "slug": slug.current,
      mainImage,
      body,
      description,
      author -> {
        name,
        image
      }
    }`
    const posts = await sanityClient.fetch(queryPosts)

    return {
        props: {posts}
    }
}

export default Home
