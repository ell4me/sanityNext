export interface Post {
    '_id': string
    author: {
        name: string
        image: {}
    }
    mainImage: {}
    slug: string
    body: {}[],
    title: string
    description: string
    publishedAt: string
    comments: {
        _id: string
        name: string
        email: string
        comment: string
    }[]
}

export interface Inputs {
    name: string
    email: string
    comment: string
    _id: string
}