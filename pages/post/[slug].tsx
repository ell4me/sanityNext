import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {Header} from "../../components/Header";
import {Inputs, Post} from "../../types";
import {sanityClient, urlFor} from "../../sanity";
import {ParsedUrlQuery} from "querystring";
import PortableText from "react-portable-text";
import {SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";

interface Props {
    post: Post
}


const Post:NextPage<Props> = ({post}) => {
    const [submitted, setSubmitted] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        fetch('/api/comment', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(() => {
            setSubmitted(true)
            console.log(data)
        }).catch((e) => {
            setSubmitted(false)
            console.log(e)
        })
    }
    return (
        <>
            <Header />
            <main>
                <img src={urlFor(post.mainImage).url()} className={'h-40 w-full object-cover'} alt='#'/>
                <div className={'max-w-3xl mx-auto lg:py-10 px-5 py-5'}>
                    <div className={'space-y-4 pb-5'}>
                        <h1 className={'text-3xl'}>{post.title}</h1>
                        <h2 className={'text-gray-500 text-xl'}>{post.description}</h2>
                        <div className={'flex flex-row items-center'}>
                            <img className={'h-12 w-12 rounded-full'} src={urlFor(post.author.image).url()} alt="#"/>
                            <div className={'text-gray-400 ml-3'}>
                                Blog post by {' '}
                                <span className={'italic text-gray-300'}>{post.author.name}</span>
                                <span> - Published at {new Date(post.publishedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <PortableText content={post.body}
                                  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                                  projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                                  serializers={{
                                      h1: (props: any) => (
                                          <h1 className={'text-2xl font-bold my-5'} {...props} />
                                      ),
                                      h2: (props: any) => (
                                          <h1 className={'text-xl font-bold my-5'} {...props} />
                                      ),
                                      li: ({ children }: any) => (
                                          <li className="ml-4 list-disc">{children}</li>
                                      ),
                                  }}
                    />
                </div>
                <hr className={'max-w-lg my-5 mx-auto border border-yellow-500'}/>
                {submitted ? <span className={'text-yellow-500 py-5 text-3xl max-w-3xl mx-auto block'}>
                        Comment submitted!</span> :
                <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col p-5 max-w-3xl mx-auto mb-10'}>
                    <h4 className={'text-sm text-yellow-500'}>Enjoyed this article?</h4>
                    <h3 className={'text-3xl font-bold'}>Leave a comment below!</h3>
                    <hr className={'py-3 mt-2'} />
                    <input {...register('_id')} type="hidden" name={'_id'} value={post._id}/>

                    <input className={'shadow bg-white border rounded-sm px-3 py-2 outline-yellow-500 mb-3'}
                           {...register('name', {required: true})}
                           type="text" placeholder={'Type name...'}/>
                    <input className={'shadow bg-white border rounded-sm px-3 py-2 outline-yellow-500 mb-3'}
                           {...register('email', {required: true})}
                           type="email" placeholder={'Type email...'}/>
                    <textarea className={'shadow resize-none bg-white border rounded-sm px-3 py-2 outline-yellow-500 mb-3'}
                           {...register('comment', {required: true})} rows={8}
                              placeholder={'Type comment...'}/>
                    <div className={'flex flex-col space-y-2'}>
                        {errors.name && <span className={'text-red-500'}>{'The name field is required.'}</span>}
                        {errors.email && <span className={'text-red-500'}>{'The email field is required.'}</span>}
                        {errors.comment && <span className={'text-red-500'}>{'The comment field is required.'}</span>}
                    </div>
                    <input className={'hover:bg-amber-400 font-bold cursor-pointer bg-yellow-500 mt-5 rounded-sm text-white py-2'}
                           value={'Submit'} type="submit"/>
                </form>
                }
                {!!post.comments.length &&
                    <div className={'shadow p-10 max-w-3xl mx-auto mb-10 shadow-yellow-500'}>
                        <h1 className={'text-3xl font-bold'}>Comments</h1>
                        <hr className={'py-3 mt-2'} />
                        <div className={'space-y-4'}>
                            {post.comments.map(item => {
                                return (
                                    <div className={'flex'}>
                                        <span className={'text-yellow-500 mr-2'}>{item.name}</span>
                                        <span>{item.comment}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const query = `*[_type == "post"][].slug.current`
    const slugs: string[] = await sanityClient.fetch(query)

    return {
        paths: slugs.map(slug => ({params: {slug}})),
        fallback: 'blocking'
    }
}

interface IParams extends ParsedUrlQuery {
    slug: string
}

export const getStaticProps: GetStaticProps = async ({params}) => {

    const {slug} = params as IParams
    const query = `*[_type == "post" && $slug == slug.current][0]{
      _id,
      title,
      body,
      mainImage,
      description,
      publishedAt,
      author -> {
        name,
        image
      },
      "comments": *[_type == "comment" && references(^._id) && approved == true]{
        _id,
        name,
        email,
        comment
      }
    }`

    const post = await sanityClient.fetch(query, {slug})

    return post ? {
        props: {post},
        revalidate: 60
    } : {notFound: true}

}

export default Post