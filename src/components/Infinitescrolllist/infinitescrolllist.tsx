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
    threshold = 0.1,
}: InfiniteScrollListProps<T>) => {
    // Scrollable container - IntersectionObserver root ku ithu thaan use pannanum
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Guard against duplicate calls while a request is already in flight
    const fetchingRef = useRef(false);
    useEffect(() => {
        fetchingRef.current = loading;
    }, [loading]);

    // hasMore ah ref la vachikonga - stale closure issue varama irukka
    const hasMoreRef = useRef(hasMore);
    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    const onLoadMoreRef = useRef(onLoadMore);
    useEffect(() => {
        onLoadMoreRef.current = onLoadMore;
    }, [onLoadMore]);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMoreRef.current && !fetchingRef.current) {
                fetchingRef.current = true; // set immediately, do not wait for state update
                onLoadMoreRef.current();
            }
        },
        []
    );

    useEffect(() => {
        // container innum DOM la mount aagalanna wait pannunga
        if (!containerRef.current || !sentinelRef.current) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(handleIntersect, {
            root: containerRef.current, // 🔑 FIX: viewport illa, ithuthaan scrollable container
            rootMargin: "0px 0px 100px 0px", // sentinel ku konjam munnadiye trigger aaga
            threshold,
        });

        observerRef.current.observe(sentinelRef.current);

        return () => observerRef.current?.disconnect();
        // items.length dependency add pannirukken - list re-render aana pinnum
        // (e.g. filter change / reset) observer fresh ah re-attach aagum
    }, [handleIntersect, threshold, items.length]);

    return (
        <Box
            ref={containerRef}
            sx={{ height, overflowY: "auto" }}
        >
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
                    {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}

                    {loading &&
                        (loader ?? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                                <CircularProgress size={22} />
                            </Box>
                        ))}

                    {!hasMore && !loading && items?.length > 0 && (
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
};