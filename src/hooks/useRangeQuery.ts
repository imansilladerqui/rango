import { useQuery } from '@tanstack/react-query'
import { fetchRange, fetchRangeFixed } from '@/services/rangeApi'

export const useRangeQuery = () =>
  useQuery({
    queryKey: ['range'],
    queryFn: fetchRange,
    staleTime: Infinity,
  })

export const useRangeFixedQuery = () =>
  useQuery({
    queryKey: ['range-fixed'],
    queryFn: fetchRangeFixed,
    staleTime: Infinity,
  })
