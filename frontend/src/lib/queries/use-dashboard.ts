import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { DepartmentKPIs } from "@/lib/types";

/**
 * Fetch department KPIs from materialized view.
 */
export function useDepartmentKPIs(departmentId: string) {
  return useQuery({
    queryKey: ["department-kpis", departmentId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: DepartmentKPIs }>(
        `/departments/${departmentId}/kpis`
      );
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — matches MV refresh
    enabled: !!departmentId,
  });
}
