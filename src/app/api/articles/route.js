import fs from 'fs';
import path from 'path';
import { db } from '@/db';
import { articles, tags, articleTags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const formData = await req.formData();

        const title = formData.get('title');
        const slug = formData.get('slug');
        const content = formData.get('content');
        const categoryId = parseInt(formData.get('categoryId'));
        const authorId = parseInt(formData.get('authorId'));
        const status = formData.get('status') || 'draft';
        const tagsArray = JSON.parse(formData.get('tags') || '[]');

        // handle thumbnail
        let thumbnailPath = null;
        const thumbnailFile = formData.get('thumbnail');
        if (thumbnailFile && thumbnailFile.arrayBuffer) {
            const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
            const fileName = Date.now() + '-' + thumbnailFile.name;
            const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
            fs.writeFileSync(filePath, buffer);
            thumbnailPath = '/uploads/' + fileName;
        }

        // insert article
        const [article] = await db.insert(articles).values({
            title,
            slug,
            content,
            categoryId,
            authorId,
            thumbnail: thumbnailPath,
            status,
        }).$returningId();

        // insert tags + articleTags
        for (const tagName of tagsArray) {
            // check if tag exists
            const existingTag = await db.select().from(tags).where(eq(tags.name, tagName));
            let tagId;

            if (existingTag.length === 0) {
                // insert new tag
                const [newTag] = await db.insert(tags).values({ name: tagName }).$returningId();
                tagId = newTag.id;
            } else {
                tagId = existingTag[0].id;
            }

            // insert into article_tags
            await db.insert(articleTags).values({ articleId: article.id, tagId });
        }

        return NextResponse.json({ success: true, articleId: article.id }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
