import React, { useContext } from 'react';
import useCars from '../hooks/useCars';
import CarList from '../components/CarList';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyListings = () => {
    const { cars, loading, error } = useCars();
    const { user } = useContext(AuthContext);

    // Filter cars to show only user's listings
    const myListings = cars.filter(car => car.sellerId === user?.id);

    return (
        <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-text">My Listings</h1>
                    <Link 
                        to="/create-listing" 
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition"
                    >
                        Create New Listing
                    </Link>
                </div>
            
            {error && (
                <div className="text-red-500 text-center py-4">
                    Error loading listings: {error.message}
                </div>
            )}
            
            {loading && cars.length === 0 && (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-100 animate-pulse h-48 rounded-lg"></div>
                    ))}
                </div>
            )}
            
            {!loading && !error && myListings.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
                    <Link 
                        to="/create-listing" 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Create Your First Listing
                    </Link>
                </div>
            )}
            
            {myListings.length > 0 && (
                <CarList cars={myListings} />
            )}
        </div>
    );
};

export default MyListings;