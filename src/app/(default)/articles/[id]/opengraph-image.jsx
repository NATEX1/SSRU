import prisma from '@/lib/prisma';
import { ImageResponse } from 'next/og'
import React from 'react'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({params}) {
    const {id} = await params;

    const article = await prisma.article.findUnique({
        where: {
            id: Number(id)
        }
    })

  return new ImageResponse(
    <div className='flex w-full h-full bg-white'>
      <img src={article?.imageUrl} alt={article?.title} className='object-cover w-full h-full' />
    </div>
  )
}
