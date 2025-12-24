"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";
import { BlogPost } from "@/lib/blog";
import Image from "next/image";
import Link from "next/link";

interface BlogCarouselProps {
  posts: BlogPost[];
}

export function BlogCarousel({ posts }: BlogCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visiblePosts, setVisiblePosts] = useState(1);

  // Determinar quantos posts mostrar baseado no tamanho da tela
  useEffect(() => {
    const updateVisiblePosts = () => {
      if (window.innerWidth >= 1024) {
        setVisiblePosts(3); // Desktop: 3 posts
      } else if (window.innerWidth >= 768) {
        setVisiblePosts(2); // Tablet: 2 posts
      } else {
        setVisiblePosts(1); // Mobile: 1 post
      }
    };

    updateVisiblePosts();
    window.addEventListener('resize', updateVisiblePosts);
    return () => window.removeEventListener('resize', updateVisiblePosts);
  }, []);

  const maxIndex = Math.max(0, posts.length - visiblePosts);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === maxIndex ? 0 : prevIndex + 1
    );
  };

  // Auto-play do carrossel
  useEffect(() => {
    if (posts.length <= visiblePosts) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [currentIndex, maxIndex, posts.length, visiblePosts]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum post encontrado</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carrossel */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visiblePosts)}%)`
          }}
        >
          {posts.map((post, index) => (
            <div 
              key={post.slug} 
              className={`flex-shrink-0 px-3 ${
                visiblePosts === 1 ? 'w-full' : 
                visiblePosts === 2 ? 'w-1/2' : 'w-1/3'
              }`}
            >
              <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 h-full group">
                {/* Imagem */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback para emoji se a imagem não carregar
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <div class="text-6xl">📝</div>
                          </div>
                        `;
                      }
                    }}
                  />
                  {/* Badge da categoria */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-pink-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-grow">
                  {/* Meta informações */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Botão de leitura */}
                  <Link href={`/blog/${post.slug}`}>
                    <Button 
                      variant="outline" 
                      className="w-full text-pink-500 border-pink-300 hover:bg-pink-50 hover:border-pink-400 transition-all"
                    >
                      Ler mais
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Controles do carrossel */}
      {posts.length > visiblePosts && (
        <>
          {/* Botões de navegação */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all z-10"
            aria-label="Post anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all z-10"
            aria-label="Próximo post"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Indicadores de posição */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-pink-500 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}