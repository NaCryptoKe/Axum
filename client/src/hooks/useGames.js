import { useState, useCallback } from 'react';
import * as gameService from '../services/gameService';

export const useGames = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Combined Data State
    const [data, setData] = useState({
        popular: [],
        newArrivals: [],
        topRated: [],
        library: [],
        orgGames: [], // For the Org Page list
        currentDetails: null // For specific game detail page
    });

    // --- Discovery & Library Logic ---
    const fetchAllHomeData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [pop, nev, top, lib] = await Promise.all([
                gameService.getPopularGames(),
                gameService.getNewGames(),
                gameService.getTopRatedGames(),
                gameService.getPlayerLibrary()
            ]);

            setData(prev => ({
                ...prev,
                popular: pop.data || [],
                newArrivals: nev.data || [],
                topRated: top.data || [],
                library: lib.data || []
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Management & Organization Logic ---
    const fetchOrgGames = useCallback(async (orgSlug) => {
        setLoading(true);
        setError(null);
        try {
            const res = await gameService.getOrganizationGames(orgSlug);
            if (res.status === 'success') {
                setData(prev => ({ ...prev, orgGames: res.data || [] }));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addNewGame = useCallback(async (gameData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await gameService.createGame(gameData);
            console.log(res)
            if (res.status === "success") return res.data;
            throw new Error(res.message);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getDetails = useCallback(async (orgSlug, gameSlug) => {
        setLoading(true);
        setError(null);
        try {
            const res = await gameService.getGameDetail(orgSlug, gameSlug);
            setData(prev => ({ ...prev, currentDetails: res.data }));
            return res.data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Reviews ---
    const submitReview = useCallback(async (reviewData) => {
        setLoading(true);
        try {
            const res = await gameService.postReview(reviewData);
            return res;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        fetchAllHomeData,
        fetchOrgGames,
        addNewGame,
        getDetails,
        submitReview,
        clearError: () => setError(null)
    };
};