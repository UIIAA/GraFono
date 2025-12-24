import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

// Dynamically import fs only when needed
async function getFsModule() {
  if (typeof window === 'undefined') {
    // Only import fs on the server side
    const fs = await import('fs');
    return fs.default;
  }
  throw new Error('fs module is not available in the browser');
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const fs = await getFsModule();
    
    // Verificar se o diretório existe
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(name => name.endsWith('.md'))
      .map((name) => {
        const slug = name.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || '',
          excerpt: data.excerpt || '',
          image: '',
          date: data.date || '',
          category: data.category || '',
          readTime: data.readTime || '5 min',
          content,
        } as BlogPost;
      });

    // Ordenar por data (mais recente primeiro)
    return allPostsData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fs = await getFsModule();
    
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      image: '',
      date: data.date || '',
      category: data.category || '',
      readTime: data.readTime || '5 min',
      content,
    } as BlogPost;
  } catch (error) {
    console.error('Erro ao carregar post:', error);
    return null;
  }
}

export async function getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, limit);
}