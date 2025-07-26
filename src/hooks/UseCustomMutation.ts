import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type MutationFunction,
} from '@tanstack/react-query'

type CustomMutationProps<TData, TError, TVariables, TContext> = {
  execute: MutationFunction<TData, TVariables>
  refetch?: string | string[]
  onSuccess?: UseMutationOptions<
    TData,
    TError,
    TVariables,
    TContext
  >['onSuccess']
} & Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn' | 'onSuccess'
>

export function useCustomMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(props: CustomMutationProps<TData, TError, TVariables, TContext>) {
  const queryClient = useQueryClient()

  const { execute, refetch, onSuccess, ...rest } = props

  return useMutation({
    mutationFn: execute,
    onSuccess: async (data, variables, context) => {
      if (refetch) {
        const keys = Array.isArray(refetch) ? refetch : [refetch]
        for (const key of keys) {
          await queryClient.invalidateQueries({ queryKey: [key] })
        }
      }

      if (onSuccess) {
        return onSuccess(data, variables, context)
      }
    },
    ...rest,
  })
}
