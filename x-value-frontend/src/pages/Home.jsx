import React, { useState } from 'react';
import CarList from '../components/CarList';
import SearchFilters from '../components/SearchFilters';
import useCars from '../hooks/useCars';

const Home = () => {
    const [filters, setFilters] = useState({});
    const { cars, loading, error } = useCars(filters);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-text">Car Listings</h1>
            <SearchFilters onFiltersChange={setFilters} />
                        {loading && <div className="text-center py-4">Loading...</div>}
                        {error && <div className="text-red-500 text-center py-4">Error loading listings</div>}
                        {!loading && !error && (
                            <div className="space-y-4">
                                <CarList cars={cars} />
                            </div>
                        )}
        </div>
    );
};

export default Home;