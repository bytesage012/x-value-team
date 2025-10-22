import React from 'react';
import CarList from '../components/CarList';
import useCars from '../hooks/useCars';

const Home = () => {
    const { cars, loading, error } = useCars();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-text">Car Listings</h1>
            {loading && <div className="text-center py-4">Loading...</div>}
            {error && <div className="text-red-500 text-center py-4">Error loading listings</div>}
            <div className="space-y-4">
                <CarList cars={cars} />
            </div>
        </div>
    );
};

export default Home;