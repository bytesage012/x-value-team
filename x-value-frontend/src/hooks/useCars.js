import { useState, useEffect } from 'react';
import { getListings } from '../services/api';

const useCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCars = async () => {
            try {
                const data = await getListings();
                setCars(data.listings || []);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getCars();
    }, []);

    return { cars, loading, error };
};

export default useCars;