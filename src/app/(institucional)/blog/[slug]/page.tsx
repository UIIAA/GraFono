"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { BlogPost } from '@/lib/blog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch the specific post
        const postResponse = await fetch(`/api/blog/${slug}`);
        if (postResponse.ok) {
          const postData = await postResponse.json();
          setPost(postData);
        }

        // Fetch related posts
        const relatedResponse = await fetch('/api/blog?limit=10');
        if (relatedResponse.ok) {
          const allPosts = await relatedResponse.json();
          const filteredPosts = allPosts.filter((p: BlogPost) => p.slug !== slug).slice(0, 2);
          setRelatedPosts(filteredPosts);
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Post não encontrado</h1>
            <p className="text-gray-600 mb-6">O artigo que você está procurando não existe ou foi removido.</p>
            <Link href="/">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                Voltar ao início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-pink-500 hover:bg-pink-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao site
            </Button>
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero do artigo */}
          <div className="relative mb-12">
            {/* Imagem de capa */}
            <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-2xl shadow-xl mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <div class="text-8xl">📝</div>
                      </div>
                    `;
                  }
                }}
              />

              {/* Overlay com informações */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-pink-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  {post.title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Meta informações */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" />
                <span>{new Date(post.date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-500" />
                <span>{post.readTime} de leitura</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-pink-500" />
                <span>{post.category}</span>
              </div>
            </div>
          </div>

          {/* Conteúdo do artigo */}
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:my-1">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="mt-12">
            <Card className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Gostou do conteúdo?</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Se você tem dúvidas sobre o desenvolvimento da fala do seu filho ou precisa de orientação especializada,
                  estou aqui para ajudar!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://wa.me/5511991556534?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o" target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="bg-white text-pink-500 hover:bg-gray-100">
                      Agendar Avaliação
                    </Button>
                  </a>
                  <a href="https://wa.me/5511991556534" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts relacionados */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Outros artigos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-all border-0 h-full group">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                  <div class="text-4xl">📝</div>
                                </div>
                              `;
                          }
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}