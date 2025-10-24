import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, updateListing, getUserPublic } from '../services/api';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const trackRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const autoScrollInterval = useRef(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        price: '',
        images: '',
        year: '',
        mileage: '',
        fuelType: '',
        transmission: '',
        location: '',
        make: '',
        model: ''
    });
    const [seller, setSeller] = useState(null);

    // simple relative time formatter: returns 'x minutes/hours/days ago'
    const formatRelative = (iso) => {
        try {
            const then = new Date(iso).getTime();
            const now = Date.now();
            const diffSeconds = (now - then) / 1000; // seconds (float)

            if (diffSeconds < 60) {
                const s = Math.round(diffSeconds);
                return `${s} second${s !== 1 ? 's' : ''} ago`;
            }
            const diffMinutes = diffSeconds / 60;
            if (diffMinutes < 60) {
                const m = Math.round(diffMinutes);
                return `${m} minute${m !== 1 ? 's' : ''} ago`;
            }
            const diffHours = diffMinutes / 60;
            if (diffHours < 24) {
                const h = Math.round(diffHours);
                return `${h} hour${h !== 1 ? 's' : ''} ago`;
            }
            const diffDays = diffHours / 24;
            if (diffDays < 7) {
                const d = Math.round(diffDays);
                return `${d} day${d !== 1 ? 's' : ''} ago`;
            }
            const diffWeeks = diffDays / 7;
            if (diffWeeks < 52) {
                const w = Math.round(diffWeeks);
                return `${w} week${w !== 1 ? 's' : ''} ago`;
            }
            const years = Math.round(diffDays / 365);
            return `${years} year${years !== 1 ? 's' : ''} ago`;
        } catch (e) {
            return iso;
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const l = await getListingById(id);
                setListing(l);
                // fetch seller name
                if (l.sellerId) {
                    getUserPublic(l.sellerId).then(u => setSeller(u)).catch(() => setSeller(null));
                }
                setEditForm({
                    title: l.title,
                    description: l.description,
                    price: l.price,
                    images: l.images.join(', '),
                    year: l.year || '',
                    mileage: l.mileage || '',
                    fuelType: l.fuelType || '',
                    transmission: l.transmission || '',
                    location: l.location || '',
                    make: l.make || '',
                    model: l.model || ''
                });
                setCurrentImageIndex(0);

                // Start auto-scroll if there are multiple images
                if (l.images && l.images.length > 1) {
                    autoScrollInterval.current = setInterval(() => {
                        if (!isPaused) {
                            setCurrentImageIndex(current => (current + 1) % l.images.length);
                        }
                    }, 3000); // Change image every 3 seconds
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();

        // Cleanup interval on unmount
        return () => {
            if (autoScrollInterval.current) {
                clearInterval(autoScrollInterval.current);
            }
        };
    }, [id, isPaused]);

    // keyboard navigation: left/right to change images, Esc to go back
    useEffect(() => {
        const onKey = (e) => {
            if (!listing || !listing.images || listing.images.length <= 1) return;
            if (e.key === 'ArrowLeft') {
                setCurrentImageIndex((i) => (i - 1 + listing.images.length) % listing.images.length);
            } else if (e.key === 'ArrowRight') {
                setCurrentImageIndex((i) => (i + 1) % listing.images.length);
            } else if (e.key === 'Escape') {
                navigate(-1);
            }
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [listing, navigate]);

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: editForm.title,
                description: editForm.description,
                price: Number(editForm.price),
                images: editForm.images.split(',').map(s => s.trim()).filter(Boolean),
                year: editForm.year ? Number(editForm.year) : undefined,
                mileage: editForm.mileage ? Number(editForm.mileage) : undefined,
                fuelType: editForm.fuelType || undefined,
                transmission: editForm.transmission || undefined,
                location: editForm.location || undefined,
                make: editForm.make || undefined,
                model: editForm.model || undefined
            };
            const updated = await updateListing(id, payload, token);
            setListing(updated.listing || updated);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
    if (!listing) return <div className="text-center p-4">Listing not found</div>;

    const image = (listing.images && listing.images[0]) || 'https://via.placeholder.com/800x480?text=No+Image';
    const isOwner = user && user.id === listing.sellerId;

    return (
        <div className="max-w-3xl mx-auto p-4">
            {!isEditing ? (
                <>
                        <div className="bg-white rounded-md shadow-md overflow-hidden mb-6">
                                <div className="relative group">
                                                {/* Back button */}
                                                <button
                                                    onClick={() => navigate(-1)}
                                                    className="absolute left-4 top-4 z-20 bg-white/80 text-text p-2 rounded-full shadow hover:bg-white"
                                                    aria-label="Go back"
                                                >
                                                    ←
                                                </button>
                                                
                                                {/* Carousel / Image area with smooth sliding and touch support */}
                                                <div
                                                    className="relative w-full h-64 bg-gray-100 overflow-hidden"
                                                    onMouseEnter={() => setIsPaused(true)}
                                                    onMouseLeave={() => setIsPaused(false)}
                                                    onTouchStart={(e) => {
                                                        setIsPaused(true);
                                                        touchEndX.current = null;
                                                        touchStartX.current = e.touches && e.touches[0] ? e.touches[0].clientX : null;
                                                    }}
                                                    onTouchMove={(e) => {
                                                        touchEndX.current = e.touches && e.touches[0] ? e.touches[0].clientX : null;
                                                    }}
                                                    onTouchEnd={() => {
                                                        if (touchStartX.current == null || touchEndX.current == null) return;
                                                        const delta = touchStartX.current - touchEndX.current;
                                                        const threshold = 50; // px
                                                        if (delta > threshold) {
                                                            // swipe left = next
                                                            setCurrentImageIndex((i) => (i + 1) % listing.images.length);
                                                        } else if (delta < -threshold) {
                                                            // swipe right = prev
                                                            setCurrentImageIndex((i) => (i - 1 + listing.images.length) % listing.images.length);
                                                        }
                                                        touchStartX.current = null;
                                                        touchEndX.current = null;
                                                        // Resume auto-scroll after a brief delay
                                                        setTimeout(() => setIsPaused(false), 1000);
                                                    }}
                                                >
                                                    {listing.images && listing.images.length > 0 ? (
                                                        <div
                                                            ref={trackRef}
                                                            className="h-64 flex transition-transform duration-300 ease-out"
                                                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                                        >
                                                            {listing.images.map((src, idx) => (
                                                                <div key={idx} className="min-w-full h-64 flex-shrink-0">
                                                                    <img src={src} alt={`${listing.title} image ${idx + 1}`} className="w-full h-64 object-cover" loading="lazy" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <img src={'https://via.placeholder.com/800x480?text=No+Image'} alt="No image" className="w-full h-64 object-cover" />
                                                    )}

                                                    {/* Controls and indicators */}
                                                    {listing.images && listing.images.length > 1 && (
                                                        <>
                                                            {/* Navigation buttons */}
                                                            <button
                                                                onClick={() => {
                                                                    setIsPaused(true);
                                                                    setCurrentImageIndex((i) => (i - 1 + listing.images.length) % listing.images.length);
                                                                    setTimeout(() => setIsPaused(false), 1000);
                                                                }}
                                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                                                                aria-label="Previous image"
                                                            >
                                                                ‹
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setIsPaused(true);
                                                                    setCurrentImageIndex((i) => (i + 1) % listing.images.length);
                                                                    setTimeout(() => setIsPaused(false), 1000);
                                                                }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                                                                aria-label="Next image"
                                                            >
                                                                ›
                                                            </button>

                                                            {/* Keyboard navigation hint */}
                                                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs py-1 px-3 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                                                                Use ← → keys to navigate
                                                            </div>

                                                            {/* Indicators */}
                                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                                                                {listing.images.map((_, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => setCurrentImageIndex(idx)}
                                                                        className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-primary' : 'bg-white/70'}`}
                                                                        aria-label={`Show image ${idx + 1}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}

                                                    {listing.verifiedSeller && (
                                                        <span className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                                                            ✓ Verified Seller
                                                        </span>
                                                    )}
                                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className="text-2xl font-bold text-text">{listing.title}</h1>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                toast.success('Link copied to clipboard!');
                                            }}
                                            className="text-gray-600 hover:text-primary p-2 rounded-full hover:bg-gray-100"
                                            title="Copy link"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: listing.title,
                                                        text: `Check out this car: ${listing.title}`,
                                                        url: window.location.href,
                                                    }).catch(console.error);
                                                }
                                            }}
                                            className="text-gray-600 hover:text-primary p-2 rounded-full hover:bg-gray-100"
                                            title="Share listing"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                        </button>
                                        {isOwner && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
                                            >
                                                Edit Listing
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-2xl text-primary font-semibold mb-2">${listing.price.toLocaleString()}</p>
                                <p className="text-gray-700 mb-4">{listing.description}</p>

                                {/* Additional details from the listing */}
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
                                    <div><strong>Year:</strong> {listing.year ?? '—'}</div>
                                    <div><strong>Mileage:</strong> {listing.mileage ? `${listing.mileage.toLocaleString()} km` : '—'}</div>
                                    <div><strong>Fuel:</strong> {listing.fuelType ?? '—'}</div>
                                    <div><strong>Transmission:</strong> {listing.transmission ?? '—'}</div>
                                    <div><strong>Location:</strong> {listing.location ?? '—'}</div>
                                    <div><strong>Make:</strong> {listing.make ?? '—'}</div>
                                    <div><strong>Model:</strong> {listing.model ?? '—'}</div>
                                    <div><strong>Seller:</strong> {seller?.name ?? listing.sellerId ?? '—'}</div>
                                    <div><strong>Verified Seller:</strong> {listing.verifiedSeller ? 'Yes' : 'No'}</div>
                                    <div><strong>Created:</strong> {formatRelative(listing.createdAt)}</div>
                                    <div><strong>Updated:</strong> {formatRelative(listing.updatedAt)}</div>
                                </div>
                            </div>
                        </div>
                </>
            ) : (
                <form onSubmit={handleEdit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={editForm.title}
                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                            placeholder="Title"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                        />
                        <input
                            type="number"
                            value={editForm.price}
                            onChange={e => setEditForm({...editForm, price: e.target.value})}
                            placeholder="Price"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="number"
                            value={editForm.year}
                            onChange={e => setEditForm({...editForm, year: e.target.value})}
                            placeholder="Year"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                        <input
                            type="number"
                            value={editForm.mileage}
                            onChange={e => setEditForm({...editForm, mileage: e.target.value})}
                            placeholder="Mileage"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                        <input
                            type="text"
                            value={editForm.location}
                            onChange={e => setEditForm({...editForm, location: e.target.value})}
                            placeholder="Location"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            value={editForm.make}
                            onChange={e => setEditForm({...editForm, make: e.target.value})}
                            placeholder="Make"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                        <input
                            type="text"
                            value={editForm.model}
                            onChange={e => setEditForm({...editForm, model: e.target.value})}
                            placeholder="Model"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                        <input
                            type="text"
                            value={editForm.fuelType}
                            onChange={e => setEditForm({...editForm, fuelType: e.target.value})}
                            placeholder="Fuel Type (petrol|diesel|electric|hybrid)"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={editForm.transmission}
                            onChange={e => setEditForm({...editForm, transmission: e.target.value})}
                            placeholder="Transmission (manual|automatic)"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                        <input
                            type="text"
                            value={editForm.images}
                            onChange={e => setEditForm({...editForm, images: e.target.value})}
                            placeholder="Image URLs (comma separated)"
                            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="w-full sm:w-auto border border-gray-200 text-text px-4 py-3 rounded-lg hover:shadow-sm transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CarDetails;