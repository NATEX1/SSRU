import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

async function main() {
    const password = await bcrypt.hash('password123', 12)

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {},
        create: {
            email: 'admin@gmail.com',
            name: 'Admin User',
            password,
            role: 'admin',
            status: 'active'
        },
    })
    console.log('Created:', admin.email)

    // Create Author
    const author = await prisma.user.upsert({
        where: { email: 'author@gmail.com' },
        update: {},
        create: {
            email: 'author@gmail.com',
            name: 'Author User',
            password,
            role: 'author',
            status: 'active'
        },
    })
    console.log('Created:', author.email)

    // Create Approver
    const approver = await prisma.user.upsert({
        where: { email: 'approver@gmail.com' },
        update: {},
        create: {
            email: 'approver@gmail.com',
            name: 'Approver User',
            password,
            role: 'approver',
            status: 'active'
        },
    })
    console.log('Created:', approver.email)

    // Create Categories
    const categories = [
        { name: 'ข่าวประชาสัมพันธ์', slug: 'news' },
        { name: 'กิจกรรมคณะ', slug: 'activities' },
        { name: 'บทความวิชาการ', slug: 'academic' },
    ]

    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug
            }
        })
        console.log('Created Category:', category.name)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
