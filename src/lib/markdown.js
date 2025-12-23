import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'src/articles');

export function getAllPosts() {
  const fileNames = fs.readdirSync(articlesDirectory);
  
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        thumbnail: data.thumbnail,
        excerpt: data.excerpt,
        author: data.author,
        date: formatThaiDate(data.date),
        category: data.category,
        readCount: data.readCount || 0,
        shareCount: data.shareCount || 0,
        keywords: data.keywords || [],
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allPosts;
}

export function getPostBySlug(slug) {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      thumbnail: data.thumbnail,
      excerpt: data.excerpt,
      author: data.author,
      date: formatThaiDate(data.date),
      category: data.category,
      readCount: data.readCount || 0,
      shareCount: data.shareCount || 0,
      keywords: data.keywords || [],
      content,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(articlesDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
}

export function getPostsByCategory(categorySlug) {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.category === categorySlug);
}

// ฟังก์ชันสำหรับดึงหมวดหมู่ทั้งหมดที่มีบทความ
export function getAllCategories() {
  const allPosts = getAllPosts();
  const categories = new Set();
  
  allPosts.forEach(post => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  
  return Array.from(categories).map(category => ({
    slug: category,
    name: getCategoryName(category),
    count: allPosts.filter(p => p.category === category).length
  }));
}

// ฟังก์ชันช่วยสำหรับแปลง category slug เป็นชื่อไทย
function getCategoryName(slug) {
  const categoryMap = {
    'executive-thoughts': 'เปิดมุมคิดผู้บริหาร',
    'career-path-conversations': 'สนทนาบนเส้นทางงาน',
    'featured-research': 'งานวิจัยแนะนำ',
    'research': 'งานวิจัย',
    'technology': 'เทคโนโลยี',
    'innovation': 'นวัตกรรม'
  };
  
  return categoryMap[slug] || slug;
}
const formatThaiDate = (dateString) => {
    const date = new Date(dateString);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 
      'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 
      'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    
    return `${day} ${month} ${year}`;
  };