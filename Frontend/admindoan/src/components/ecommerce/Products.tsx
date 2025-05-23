import { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import { sanPhamService } from '../../api/sanpham';
import { SanPhamDto } from '../../types/sanpham';
import { cartService } from '../../api/cart';
import { toast } from 'react-hot-toast';

export default function Products() {
    const [products, setProducts] = useState<SanPhamDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [addingToCart, setAddingToCart] = useState<{ [key: string]: boolean }>({});

    // Add to cart function that calls the API
    const addToCart = async (id: string) => {
        try {
            // Track loading state for this specific product
            setAddingToCart(prev => ({ ...prev, [id]: true }));

            await cartService.addToCart({
                sanPhamId: id,
                soLuong: 1
            });

            toast.success('Đã thêm sản phẩm vào giỏ hàng!');
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
        } finally {
            setAddingToCart(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleWishlist = (id: string) => {
        console.log(`Toggled wishlist for product ${id}`);

        // Simple simulation of wishlist toggling
        if (wishlistIds.includes(id)) {
            setWishlistIds(wishlistIds.filter(itemId => itemId !== id));
        } else {
            setWishlistIds([...wishlistIds, id]);
        }
        // Here you would call your wishlist API
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await sanPhamService.getAll(1, 12); // Get first 12 products
                setProducts(response.items);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-medium mb-5">Sản phẩm của chúng tôi</h2>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                </div>
            ) : (
                <div className="flex flex-wrap -mx-3">
                    {products.map((product) => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            isWished={wishlistIds.includes(product.id)}
                            handleWishlist={handleWishlist}
                            addToCart={addToCart}
                            isAddingToCart={addingToCart[product.id]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 