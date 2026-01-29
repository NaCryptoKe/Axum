import { useState, useCallback } from 'react';
import * as gameService from '../services/gameService';

export const useGames = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        popular: [],
        newArrivals: [],
        topRated: [],
        library: []
    });

    // --- Discovery & Library Logic ---
    
    const fetchAllHomeData = async () => {
        setLoading(true);
        try {
            // Fetch everything in parallel for better performance
            const [pop, nev, top, lib] = await Promise.all([
                gameService.getPopularGames(),
                gameService.getNewGames(),
                gameService.getTopRatedGames(),
                gameService.getPlayerLibrary()
            ]);

            setData({
                popular: pop.data || [],
                newArrivals: nev.data || [],
                topRated: top.data || [],
                library: lib.data || []
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Management Logic (Create/Update/Review) ---

    const addNewGame = async (gameData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await gameService.createGame(gameData);
            if (res.status === "success") return res.data;
            throw new Error(res.message);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const submitReview = async (reviewData) => {
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
    };

    const getDetails = async (orgSlug, gameSlug) => {
        setLoading(true);
        try {
            const res = await gameService.getGameDetail(orgSlug, gameSlug);
            return res.data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        fetchAllHomeData,
        addNewGame,
        submitReview,
        getDetails,
        // Helper to clear errors manually
        clearError: () => setError(null)
    };
};