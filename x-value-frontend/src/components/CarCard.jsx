import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import Skeleton from './Skeleton';
import AuthContext from '../context/AuthContext';
import { toggleBookmark, isBookmarked as checkIsBookmarked } from '../services/api';

const CarCard = ({ car }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
    const { token, isAuthenticated } = useContext(AuthContext);
    const autoScrollInterval = useRef(null);
    const images = car.images || ['https://via.placeholder.com/400x240?text=No+Image'];

    useEffect(() => {
        const checkBookmarkStatus = async () => {
            // Reset bookmark state if not authenticated
            if (!isAuthenticated || !token) {
                setIsBookmarked(false);
                return;
            }

            try {
                const status = await checkIsBookmarked(car.id, token);
                setIsBookmarked(status);
            } catch (err) {
                // Only log non-404 errors since 404 is handled in the API function
                if (!err.response || err.response.status !== 404) {
                    console.error('Error checking bookmark status:', err);
                }
                setIsBookmarked(false);
            }
        };
        
        checkBookmarkStatus();
    }, [car.id, token, isAuthenticated]);
    
    useEffect(() => {
        if (isHovered && images.length > 1) {
            autoScrollInterval.current = setInterval(() => {
                setCurrentImageIndex(current => (current + 1) % images.length);
            }, 2000); // Change image every 2 seconds when hovered
        }
        return () => {
            if (autoScrollInterval.current) {
                clearInterval(autoScrollInterval.current);
            }
        };
    }, [isHovered, images.length]);

    return (
        <Link 
            to={`/car/${car.id}`} 
            className="block transform hover:-translate-y-1 transition h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImageIndex(0);
            }}
            onFocus={() => setIsHovered(true)}
            onBlur={() => {
                setIsHovered(false);
                setCurrentImageIndex(0);
            }}
        >
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                <div className="relative">
                    <div className="relative w-full h-48 overflow-hidden">
                        {!imageLoaded && (
                            <div className="absolute inset-0">
                                <Skeleton className="w-full h-full" />
                            </div>
                        )}
                        <div 
                            className="flex transition-transform duration-300 ease-out h-full"
                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                        >
                            {images.map((img, index) => (
                                <img 
                                    key={index}
                                    src={img} 
                                    alt={`${car.title} - Image ${index + 1}`} 
                                    className={`w-full h-48 object-cover flex-shrink-0 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    loading="lazy"
                                    onLoad={() => setImageLoaded(true)}
                                />
                            ))}
                        </div>
                    </div>
                    {car.verifiedSeller && (
                        <span className="absolute top-3 right-3 bg-secondary text-white px-2 py-1 rounded-full text-xs font-medium">
                            ✓ Verified
                        </span>
                    )}
                    {isAuthenticated && (
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isBookmarkLoading) {
                                    try {
                                        setIsBookmarkLoading(true);
                                        await toggleBookmark(car.id, token);
                                        setIsBookmarked(!isBookmarked);
                                    } catch (err) {
                                        console.error('Error toggling bookmark:', err);
                                    } finally {
                                        setIsBookmarkLoading(false);
                                    }
                                }
                            }}
                            className={`absolute right-3 top-3 p-2 rounded-full bg-white/90 shadow-sm transition-all ${
                                isBookmarkLoading ? 'opacity-50' : 'hover:scale-110'
                            }`}
                            title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                        >
                            <Bookmark 
                                className={`w-4 h-4 transition-colors ${
                                    isBookmarked ? 'fill-primary text-primary' : 'fill-none text-gray-600'
                                }`} 
                            />
                        </button>
                    )}
                    {images.length > 1 && (
                        <>
                            <span className="absolute left-3 top-3 bg-white/90 text-text px-2 py-1 rounded-full text-xs font-medium">
                                {images.length} images
                            </span>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                                            idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold text-text truncate">{car.title}</h2>
                    <p className="text-md font-semibold text-primary mt-2">${car.price.toLocaleString()}</p>
                    <p className="mt-2 text-gray-600 line-clamp-2 flex-grow">{car.description}</p>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;