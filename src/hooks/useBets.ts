import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Bet } from '@/types';
import { betApi } from '@/lib/database';
import { useBetStore } from '@/stores/betStore';

// Query keys for better cache management
export const betKeys = {
  all: ['bets'] as const,
  lists: () => [...betKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...betKeys.lists(), { filters }] as const,
  details: () => [...betKeys.all, 'detail'] as const,
  detail: (id: string) => [...betKeys.details(), id] as const,
};

// Custom hook for fetching bets
export function useBets() {
  const { data: session, status } = useSession();
  const { setBets, setLoading, setError } = useBetStore();

  const query = useQuery({
    queryKey: betKeys.lists(),
    queryFn: async () => {
      const bets = await betApi.getBets();
      // Sync with Zustand store
      setBets(bets);
      return bets;
    },
    enabled: status === 'authenticated',
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Sync loading state with Zustand
  React.useEffect(() => {
    setLoading(query.isLoading);
    setError(query.error ? String(query.error) : null);
  }, [query.isLoading, query.error, setLoading, setError]);

  return {
    bets: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}

// Custom hook for creating bets with optimistic updates
export function useCreateBet() {
  const queryClient = useQueryClient();
  const { addBet } = useBetStore();

  return useMutation({
    mutationFn: async (betData: Omit<Bet, 'id'>) => {
      return await betApi.createBet(betData);
    },
    onMutate: async (newBetData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: betKeys.lists() });

      // Snapshot previous value
      const previousBets = queryClient.getQueryData<Bet[]>(betKeys.lists());

      // Optimistically update cache
      const optimisticBet: Bet = {
        ...newBetData,
        id: `temp-${Date.now()}`, // Temporary ID
      };

      queryClient.setQueryData<Bet[]>(betKeys.lists(), (old = []) => [
        optimisticBet,
        ...old,
      ]);

      // Update Zustand store optimistically
      addBet(optimisticBet);

      return { previousBets, optimisticBet };
    },
    onSuccess: (newBet, variables, context) => {
      // Replace optimistic bet with real bet
      queryClient.setQueryData<Bet[]>(betKeys.lists(), (old = []) =>
        old.map(bet => 
          bet.id === context?.optimisticBet.id ? newBet : bet
        )
      );

      // Update Zustand store with real bet
      const { updateBet, removeBet } = useBetStore.getState();
      removeBet(context?.optimisticBet.id || '');
      addBet(newBet);

      toast.success('Bet added successfully! 🎉');
    },
    onError: (error: any, variables, context) => {
      // Rollback optimistic update
      if (context?.previousBets) {
        queryClient.setQueryData(betKeys.lists(), context.previousBets);
      }

      // Rollback Zustand store
      if (context?.optimisticBet) {
        const { removeBet } = useBetStore.getState();
        removeBet(context.optimisticBet.id);
      }

      // Handle specific errors
      if (error.message?.includes('Free plan limit')) {
        toast.error('Free plan limit reached! Upgrade to Pro for unlimited bets.', {
          duration: 6000,
        });
        setTimeout(() => {
          if (confirm('Free plan limit reached! Upgrade to Pro for unlimited bets. Go to upgrade page?')) {
            window.location.href = '/upgrade';
          }
        }, 1000);
      } else {
        toast.error(error.message || 'Failed to create bet');
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: betKeys.lists() });
    },
  });
}

// Custom hook for updating bets
export function useUpdateBet() {
  const queryClient = useQueryClient();
  const { updateBet } = useBetStore();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: { result?: 'win' | 'loss' | 'push'; payout?: number } }) => {
      return await betApi.updateBet(id, updates);
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: betKeys.lists() });

      const previousBets = queryClient.getQueryData<Bet[]>(betKeys.lists());

      // Optimistically update cache
      queryClient.setQueryData<Bet[]>(betKeys.lists(), (old = []) =>
        old.map(bet => bet.id === id ? { ...bet, ...updates } : bet)
      );

      // Update Zustand store optimistically
      updateBet(id, updates);

      return { previousBets };
    },
    onSuccess: (updatedBet, { id }) => {
      // Update cache with server response
      queryClient.setQueryData<Bet[]>(betKeys.lists(), (old = []) =>
        old.map(bet => bet.id === id ? updatedBet : bet)
      );

      // Update Zustand store
      updateBet(id, updatedBet);

      const resultText = updatedBet.result === 'win' ? '🎉 Win' : 
                        updatedBet.result === 'loss' ? '😔 Loss' : '🤝 Push';
      toast.success(`Bet updated: ${resultText}`);
    },
    onError: (error: any, variables, context) => {
      if (context?.previousBets) {
        queryClient.setQueryData(betKeys.lists(), context.previousBets);
      }
      toast.error(error.message || 'Failed to update bet');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: betKeys.lists() });
    },
  });
}

// Custom hook for deleting bets
export function useDeleteBet() {
  const queryClient = useQueryClient();
  const { removeBet } = useBetStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await betApi.deleteBet(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: betKeys.lists() });

      const previousBets = queryClient.getQueryData<Bet[]>(betKeys.lists());

      // Optimistically remove from cache
      queryClient.setQueryData<Bet[]>(betKeys.lists(), (old = []) =>
        old.filter(bet => bet.id !== id)
      );

      // Remove from Zustand store optimistically
      removeBet(id);

      return { previousBets };
    },
    onSuccess: () => {
      toast.success('Bet deleted successfully');
    },
    onError: (error: any, variables, context) => {
      if (context?.previousBets) {
        queryClient.setQueryData(betKeys.lists(), context.previousBets);
      }
      toast.error(error.message || 'Failed to delete bet');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: betKeys.lists() });
    },
  });
}
