import React, { useEffect, useState, useContext } from 'react';
import { getBookmarks } from '../services/api';
import AuthContext from '../context/AuthContext';
import CarCard from '../components/CarCard';
import { Bookmark } from 'lucide-react';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!token) {
                setError('You must be logged in to view bookmarks');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getBookmarks(token);
                // The backend now returns the array directly
                setBookmarks(Array.isArray(data) ? data : (data.bookmarks || []));
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load bookmarks');
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [token]);

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <Bookmark className="text-primary" size={24} />
                <h1 className="text-2xl font-bold text-gray-900">Saved Cars</h1>
            </div>

            {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                    <Bookmark className="mx-auto text-gray-400 mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved cars yet</h2>
                    <p className="text-gray-600">
                        Start browsing and bookmark the cars you're interested in!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map(car => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;