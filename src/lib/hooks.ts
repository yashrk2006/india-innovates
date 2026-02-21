"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook for fetching data from API routes.
 * Falls back to provided default data on error.
 */
export function useApi<T>(url: string, fallback: T): { data: T; loading: boolean; error: string | null; refetch: () => void } {
    const [data, setData] = useState<T>(fallback);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            console.error(`useApi(${url}):`, err.message);
            setError(err.message);
            // Keep fallback data on error
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for POST/PATCH/PUT mutations.
 */
export function useMutation<TBody, TResult = any>(url: string, method: "POST" | "PATCH" | "PUT" = "POST") {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = useCallback(async (body: TBody): Promise<TResult | null> => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `API error: ${res.status}`);
            }
            const json = await res.json();
            setLoading(false);
            return json as TResult;
        } catch (err: any) {
            console.error(`useMutation(${url}):`, err.message);
            setError(err.message);
            setLoading(false);
            return null;
        }
    }, [url, method]);

    return { mutate, loading, error };
}
