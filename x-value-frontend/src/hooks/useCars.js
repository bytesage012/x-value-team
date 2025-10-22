import { useState, useEffect } from 'react';
import { getListings } from '../services/api';

const useCars = (filters = {}) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCars = async () => {
            try {
                setLoading(true);
                const data = await getListings(filters);
                setCars(data.listings || []);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getCars();
    }, [filters]);

    return { cars, loading, error };
};

export default useCars;