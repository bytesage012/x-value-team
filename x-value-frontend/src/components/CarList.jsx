import React from 'react';
import CarCard from './CarCard';

const CarList = ({ cars = [] }) => {
    if (!cars.length) return <div className="text-center p-4">No listings found</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map(car => (
                <CarCard key={car.id} car={car} />
            ))}
        </div>
    );
};

export default CarList;