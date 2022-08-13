// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {Inputs} from "../../types";
import {sanityClient} from "../../sanity";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {_id, ...rest} = JSON.parse(req.body) as Inputs
  try {
    await sanityClient.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id
      },
      ...rest
    })
  } catch (error) {
    res.status(500).json({message: "Couldn't submit comment", error})
  }

  res.status(200).json({message: 'Comment submitted!'})
}
