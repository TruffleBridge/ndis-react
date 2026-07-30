import React, { useRef, useCallback, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export interface InfiniteScrollListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor: (item: T, index: number) => string | number;
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    height?: number | string;
    loader?: React.ReactNode;
    endMessage?: React.ReactNode;
    emptyMessage?: React.ReactNode;
    threshold?: number; // IntersectionObserver threshold
}

export const InfiniteScrollList = <T,>({
    items,
    renderItem,
    keyExtractor,
    onLoadMore,
    hasMore,
    loading,
    height = 400,
    loader,
    endMessage,
    emptyMessage,
    threshold = 0.5,
}: InfiniteScrollListProps<T>) => {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Guard against duplicate calls while a request is already in flight
    const fetchingRef = useRef(false);
    useEffect(() => {
        fetchingRef.current = loading;
    }, [loading]);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore && !fetchingRef.current) {
                fetchingRef.current = true; // set immediately, do not wait for state update
                onLoadMore();
            }
        },
        [hasMore, onLoadMore]
    );

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(handleIntersect, {
            root: null,
            rootMargin: "0px",
            threshold,
        });

        if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);

        return () => observerRef.current?.disconnect();
    }, [handleIntersect, threshold]);

    return (
        <Box sx={{ height, overflowY: "auto" }}>
            {items.length === 0 && !loading ? (
                emptyMessage ?? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                            No data found
                        </Typography>
                    </Box>
                )
            ) : (
                <>
                    {items.map((item, index) => (
                        <React.Fragment key={keyExtractor(item, index)}>
                            {renderItem(item, index)}
                        </React.Fragment>
                    ))}

                    {/* Sentinel element observed by IntersectionObserver */}
                    <div ref={sentinelRef} style={{ height: 1 }} />

                    {loading &&
                        (loader ?? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                                <CircularProgress size={22} />
                            </Box>
                        ))}

                    {!hasMore && !loading && items.length > 0 && (
                        endMessage ?? (
                            <Box sx={{ py: 1.5, textAlign: "center" }}>
                                <Typography variant="caption" color="text.secondary">
                                    No more items
                                </Typography>
                            </Box>
                        )
                    )}
                </>
            )}
        </Box>
    );
}