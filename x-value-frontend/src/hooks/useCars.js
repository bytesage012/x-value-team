import { useState, useEffect, useRef } from 'react';
import { getListings } from '../services/api';

const useCars = (filters = {}) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mounted = useRef(false);
    const loadingTimeoutRef = useRef(null);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const getCars = async () => {
            try {
                // Only show loading state if it takes longer than 500ms
                const loadingTimeout = setTimeout(() => {
                    if (mounted.current) {
                        setLoading(true);
                    }
                }, 500);
                loadingTimeoutRef.current = loadingTimeout;

                const data = await getListings(filters);
                
                if (mounted.current) {
                    clearTimeout(loadingTimeout);
                    setCars(data.listings || []);
                    setLoading(false);
                }
            } catch (err) {
                if (mounted.current) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        getCars();

        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, [filters]);

    return { cars, loading, error };
};

export default useCars;