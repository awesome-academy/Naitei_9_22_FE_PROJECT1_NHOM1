'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Sparkles, Percent, Star } from 'lucide-react';

export default function Home() {
  const featuredCategories = [
    {
      title: 'Sản phẩm Hot Trend',
      description: 'Những sản phẩm được yêu thích nhất',
      icon: TrendingUp,
      color: 'bg-red-500',
      href: '/products?filter=hot',
      image: '/Image_Rudu/wine1.jpg'
    },
    {
      title: 'Sản phẩm mới',
      description: 'Những sản phẩm mới nhất của chúng tôi',
      icon: Sparkles,
      color: 'bg-green-500',
      href: '/products?filter=new',
      image: '/Image_Rudu/wine3.jpg'
    },
    {
      title: 'Khuyến mãi đặc biệt',
      description: 'Giảm giá lên đến 50%',
      icon: Percent,
      color: 'bg-orange-500',
      href: '/products?filter=sale',
      image: '/Image_Rudu/wine8.jpg'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-amber-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-800 mb-6">
                Vang Đô Rượu
                <span className="block text-amber-600">Since 1980</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Chuyên cung cấp các loại rượu vang và rượu ngoại cao cấp với chất lượng tuyệt vời và giá cả hợp lý.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/products">Xem sản phẩm</Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="/products?filter=hot">Sản phẩm Hot</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/Image_Rudu/banner01.png"
                  alt="Wine Collection"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Danh mục nổi bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá bộ sưu tập rượu vang và rượu ngoại cao cấp được tuyển chọn kỹ lưỡng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link key={index} href={category.href}>
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all">
                        <div className="absolute top-4 left-4">
                          <Badge className={`${category.color} text-white`}>
                            <IconComponent size={14} className="mr-1" />
                            {category.title.split(' ')[1]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-600">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Khám phá bộ sưu tập rượu vang tuyệt vời
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Từ những chai rượu vang Pháp tinh tế đến những dòng whisky Scotland đẳng cấp,
            chúng tôi mang đến cho bạn những trải nghiệm tuyệt vời nhất.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/products" className="flex items-center gap-2">
                Xem tất cả sản phẩm
                <Star size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
