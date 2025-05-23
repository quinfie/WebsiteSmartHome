/**
 * Get the correct image path, handling both absolute and relative URLs
 * @param imagePath - The image path from the server
 * @param fallbackImage - Optional fallback image URL if imagePath is empty
 * @returns The corrected image path
 */
export const getImagePath = (imagePath?: string, fallbackImage: string = '/placeholder-image.png'): string => {
    if (!imagePath) return fallbackImage;

    try {
        // Kiểm tra xem đường dẫn đã có http hoặc https chưa
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // Nếu đường dẫn bắt đầu bằng 'public/'
        if (imagePath.startsWith('public/')) {
            // Đường dẫn tương đối trong src/assets
            return `/src/assets/${imagePath}`;
        }

        // Nếu đường dẫn bắt đầu bằng '/'
        if (imagePath.startsWith('/')) {
            return imagePath;
        }

        return `/src/assets/${imagePath}`;  
    } catch (error) {
        console.error("Lỗi khi xử lý đường dẫn ảnh:", error);
        return fallbackImage;
    }
};

/**
 * Handle image loading errors by setting a fallback image
 * @param event - The error event from the img element
 * @param fallbackImage - The fallback image URL to use
 */
export const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackImage: string = '/placeholder-image.png'
): void => {
    const imgElement = event.currentTarget;
    imgElement.src = fallbackImage;
    
    // Prevent infinite error loop
    imgElement.onerror = null;
}; 