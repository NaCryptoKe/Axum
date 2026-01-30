import { useState, useCallback, useContext } from 'react';
import * as orgService from '../services/organizationService';
import * as gameService from '../services/gameService';
import { AuthContext } from '../context/AuthContext';

export const useOrganizations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Initialize complex data types safely to avoid crashes
    const [organization, setOrganization] = useState(null);
    const [members, setMembers] = useState([]); 
    const [games, setGames] = useState([]);
    const [role, setRole] = useState(null); 
    const [organizations, setOrganizations] = useState([]);
    
    const { user } = useContext(AuthContext);

    // ============================================================
    // 1. The "One-Shot" Fetch (RECOMMENDED FOR ORG PAGE)
    // ============================================================
    const fetchAllOrgData = useCallback(async (slug) => {
        setLoading(true);
        setError(null);
        try {
            // Prepare all requests to run in parallel
            const promises = [
                orgService.getOrganizationBySlug(slug),
                orgService.getOrgMembers(slug),
                gameService.getOrganizationGames(slug)
            ];

            // Only fetch role if user is logged in
            if (user?.username) {
                promises.push(orgService.getOrgMember(slug, user.username));
            }

            // Wait for everything to finish
            const results = await Promise.all(promises);
            
            // Destructure results based on index
            const orgRes = results[0];
            const memRes = results[1];
            const gameRes = results[2];
            const roleRes = user?.username ? results[3] : null;

            // Batch update state (React handles this efficiently)
            if (orgRes.status === 'success') setOrganization(orgRes.data.organization);
            
            // Handle potentially nested data structures
            if (memRes.status === 'success') setMembers(memRes.data.members || []);
            if (gameRes.status === 'success') setGames(gameRes.data || []);
            
            if (roleRes && roleRes.status === 'success') {
                setRole(roleRes.data.member.role);
            } else {
                setRole(null);
            }

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load organization data");
        } finally {
            setLoading(false);
        }
    }, [user]);

    // ============================================================
    // 2. Individual Actions (Keep these for specific updates)
    // ============================================================
    const createNewOrg = useCallback(async (orgData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orgService.createOrganization(orgData);
            return response;
        } catch (err) {
            setError(err.message || "Failed to create organization");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Individual fetchers (Legacy support or single updates)
    const fetchOrgBySlug = useCallback(async (slug) => {
        setLoading(true);
        setError(null);
        try {
            const org = await orgService.getOrganizationBySlug(slug);
            if (org.status === 'success') setOrganization(org.data.organization);
        } catch (err) {
            setError(err.message || "Failed to fetch organization");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrgMembers = useCallback(async (slug) => {
        // Note: We don't set global loading here to avoid full page flicker on small updates
        try {
            const orgMembers = await orgService.getOrgMembers(slug);
            if (orgMembers.status === 'success') setMembers(orgMembers.data.members || []);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchOrgMember = useCallback(async (slug) => {
        if (!user?.username) return; 
        try {
            const orgMember = await orgService.getOrgMember(slug, user.username);
            if (orgMember.status === 'success') setRole(orgMember.data.member.role);
        } catch (err) {
            console.error(err);
        }
    }, [user]);

    const fetchOrgGames = useCallback(async (slug) => {
        try {
            const orgGames = await gameService.getOrganizationGames(slug);
            if (orgGames.status === 'success') setGames(orgGames.data || []);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchUserOrgs = useCallback(async (username) => {
        try {
            const orgs = await orgService.getAllOrganizationsOfUser(username);
            console.log(orgs);
            if (orgs.status === 'success') setOrganizations(orgs.data || []);
        } catch (err) {
            console.error(err);
        }
    }, []) 

    return { 
        organization, 
        organizations, 
        members, 
        games, 
        role, 
        loading, 
        error,
        fetchAllOrgData, // <--- Use this one in your OrgPage useEffect
        createNewOrg, 
        fetchUserOrgs,
        fetchOrgGames, 
        fetchOrgBySlug, 
        fetchOrgMembers, 
        fetchOrgMember 
    };
};