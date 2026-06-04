/**
 * Central active-order cache — single fetch, prefetch, and invalidation for workflow screens.
 */

import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { getOrder, type BackendOrder, type OrderDetailResponse } from '../api/orders';

export const orderQueryKeys = {
  detail: (orderId: string) => ['order', orderId] as const,
  list: (riderId?: string | null) => ['orders', 'list', riderId ?? ''] as const,
  allLists: () => ['orders'] as const,
};

const ORDER_STALE_MS = 60_000;
const ORDER_GC_MS = 30 * 60_000;

export function prefetchActiveOrder(queryClient: QueryClient, orderId: string) {
  if (!orderId) return Promise.resolve();
  return queryClient.prefetchQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => getOrder(orderId),
    staleTime: ORDER_STALE_MS,
  });
}

export function setActiveOrderCache(
  queryClient: QueryClient,
  orderId: string,
  data: OrderDetailResponse
) {
  queryClient.setQueryData(orderQueryKeys.detail(orderId), data);
}

export function invalidateActiveOrder(queryClient: QueryClient, orderId?: string) {
  if (orderId) {
    queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
  }
  queryClient.invalidateQueries({ queryKey: orderQueryKeys.allLists() });
  queryClient.invalidateQueries({ queryKey: ['rider-home'] });
}

/** After delivery is finished — drop cached order so home does not reopen the workflow. */
export function clearActiveOrderCache(queryClient: QueryClient, orderId: string) {
  if (orderId) {
    queryClient.removeQueries({ queryKey: orderQueryKeys.detail(orderId) });
  }
  invalidateActiveOrder(queryClient, orderId);
}

export function useActiveOrder(orderId: string | undefined | null) {
  const id = orderId?.trim() ?? '';
  const query = useQuery({
    queryKey: orderQueryKeys.detail(id),
    queryFn: () => getOrder(id),
    enabled: !!id,
    staleTime: ORDER_STALE_MS,
    gcTime: ORDER_GC_MS,
  });

  const order: BackendOrder | undefined = query.data?.order;

  return {
    ...query,
    order,
    orderId: id,
    isReady: !!order && !query.isLoading,
  };
}
