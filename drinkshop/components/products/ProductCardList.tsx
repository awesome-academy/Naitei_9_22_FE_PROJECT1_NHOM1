import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star } from "lucide-react"
import type { Product } from "@/lib/api"
import styles from "./ProductCard.module.css"

interface ProductCardListProps {
    product: Product
    badge?: string
    badgeColor?: string
}

export default function ProductCardList({
    product,
    badge,
    badgeColor = "bg-yellow-500",
}: ProductCardListProps) {
    return (
        <Card className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-32 h-32 sm:h-40 flex-shrink-0 relative">
                        {badge && (
                            <Badge className={`absolute top-2 left-2 z-10 ${badgeColor} text-white text-xs`}>{badge}</Badge>
                        )}
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={128}
                            height={160}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold mb-2 text-sm lg:text-base hover:text-yellow-600 transition-colors cursor-pointer">
                                {product.name}
                            </h3>
                        </Link>
                        <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={i < product.rating ? styles.starFilled : styles.starEmpty}
                                    size={16}
                                    fill={i < product.rating ? "currentColor" : "none"}
                                />
                            ))}
                            <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-base lg:text-lg font-bold text-yellow-600">{product.price}</span>
                                <span className="text-sm">đ</span>
                                {product.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}đ</span>
                                )}
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button className="bg-black text-white hover:bg-gray-800 text-xs lg:text-sm flex-1 sm:flex-none">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    THÊM VÀO GIỎ
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Heart className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
