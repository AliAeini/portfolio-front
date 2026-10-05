'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { authApi, LoginRequest, AuthResponse } from '@/lib/api';
import type { AuthUser } from '@/lib/types';

interface AuthContextValue {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
}

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'authUser',
    EXPIRES_AT: 'accessTokenExpiresAt',
} as const;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function saveToStorage(user: AuthUser, data: AuthResponse) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, data.accessTokenExpiresAt);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearStorage() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
    localStorage.removeItem(STORAGE_KEYS.USER);
}

function loadFromStorage(): {
    user: AuthUser | null;
    accessToken: string | null;
} {
    try {
        const userJson = localStorage.getItem(STORAGE_KEYS.USER);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);

        if (expiresAt && new Date(expiresAt) < new Date()) {
            clearStorage();
            return { user: null, accessToken: null };
        }

        if (!userJson || !accessToken) {
            return { user: null, accessToken: null };
        }

        const user = JSON.parse(userJson) as AuthUser;
        return { user, accessToken };
    } catch {
        clearStorage();
        return { user: null, accessToken: null };
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { user: storedUser, accessToken: storedToken } = loadFromStorage();
        setUser(storedUser);
        setAccessToken(storedToken);
        setIsLoading(false);
    }, []);

    const login = useCallback(async (data: LoginRequest) => {
        const res = await authApi.login(data);

        if (!res.success || !res.data) {
            throw new Error(res.errors?.[0] || res.message || 'Login failed');
        }

        const userData: AuthUser = {
            id: '', 
            email: data.email,
            fullName: null,
            role: 'Owner',
        };

        saveToStorage(userData, res.data);
        setUser(userData);
        setAccessToken(res.data.accessToken);
    }, []);

    const logout = useCallback(() => {
        clearStorage();
        setUser(null);
        setAccessToken(null);
    }, []);

    const value: AuthContextValue = {
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}