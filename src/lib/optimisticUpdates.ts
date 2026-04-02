import {
	type MutationFunction,
	type MutationKey,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * A generic hook for creating zero-latency optimistic updates coupled with aggressive background sync.
 *
 * @param mutationKey - The React Query cache key to target for optimistic updates.
 * @param mutationFn - The actual async function that performs the Supabase mutation.
 * @param optimisticUpdateFn - A function that takes the current cached data and the mutation variables, and returns the strictly updated local data.
 * @param onOfflineQueue - A callback fired when offline, allowing the caller to enqueue the mutation properly.
 * @returns The standard useMutation result, but wrapped in optimistic logic.
 */
export function useOptimisticMutation<
	TData,
	TVariables,
	TContext = { previousData: unknown; mutationKey: MutationKey },
>(
	mutationKeyFn: (variables: TVariables) => MutationKey,
	mutationFn: MutationFunction<TData, TVariables>,
	optimisticUpdateFn: (
		oldData: unknown | undefined,
		variables: TVariables,
	) => unknown,
	onOfflineQueue: (variables: TVariables) => void,
) {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (variables: TVariables) => {
			// If we are offline, we ONLY queue the background mutation.
			// The optimistic update handles the UI instantly.
			if (!navigator.onLine) {
				onOfflineQueue(variables);
				return {} as TData; // Return a dummy object to satisfy TypeScript since the real write is deferred.
			}

			// If online, perform the actual remote mutation immediately.
			return await mutationFn(variables, undefined as never);
		},
		onMutate: async (variables) => {
			const resolvedKey = mutationKeyFn(variables);

			// 1. Cancel any outgoing refetches so they don't overwrite our optimistic update
			await queryClient.cancelQueries({ queryKey: resolvedKey });

			// 2. Snapshot the previous value
			const previousData = queryClient.getQueryData(resolvedKey);

			// 3. Optimistically update to the new value
			queryClient.setQueryData(resolvedKey, (old: unknown) =>
				optimisticUpdateFn(old, variables),
			);

			// 4. Return context object with the snapshotted value
			return { previousData, mutationKey: resolvedKey } as TContext;
		},
		onError: (err, _variables, context) => {
			// If the mutation fails, roll back to the previous value
			const typedContext = context as
				| { previousData: unknown; mutationKey: MutationKey }
				| undefined;
			if (typedContext?.previousData && typedContext.mutationKey) {
				queryClient.setQueryData(
					typedContext.mutationKey,
					typedContext.previousData,
				);
			}
			toast({
				title: "Action Failed",
				description: "Unable to save changes. Your data has been rolled back.",
				variant: "destructive",
			});
			console.error("Optimistic mutation failed:", err);
		},
		onSettled: (_data, _error, variables, context) => {
			// Always refetch after error or success to ensure 100% server sync
			if (navigator.onLine) {
				const resolvedKey =
					(context as { mutationKey?: MutationKey })?.mutationKey ||
					mutationKeyFn(variables as TVariables);
				queryClient.invalidateQueries({ queryKey: resolvedKey });
			}
		},
	});
}
