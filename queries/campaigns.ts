import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiClient } from "../lib/apiClient";
import { Campaign, CampaignCreateRequest } from "../types/campaign";

export function useCampaigns(accessToken: string | null) {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    enabled: !!accessToken,
    queryFn: async () => {
      const { data } = await getApiClient().get<Campaign[]>("/campaigns");
      return data;
    },
  });
}

export function useCampaign(accessToken: string | null, id?: string) {
  return useQuery<Campaign>({
    queryKey: ["campaigns", id],
    enabled: !!accessToken && !!id,
    queryFn: async () => {
      const { data } = await getApiClient().get<Campaign>(`/campaigns/${id}`);
      return data;
    },
  });
}

export function useCreateCampaign(accessToken: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CampaignCreateRequest) => {
      const { data } = await getApiClient().post<Campaign>("/campaigns", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaign(accessToken: string | null, id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CampaignCreateRequest) => {
      const { data } = await getApiClient().put<Campaign>(
        `/campaigns/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

