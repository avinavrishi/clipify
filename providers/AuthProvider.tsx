"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerAuth } from "../lib/apiClient";
import type { AuthTokens } from "../lib/apiClient";
import { User } from "../types/auth";
import { useMe } from "../queries/auth";

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  currentUser: User | null;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const setTokens = useCallback(
    (access: string | null, refresh: string | null) => {
      setAccessTokenState(access);
      setRefreshTokenState(refresh);
      if (!access && !refresh) {
        queryClient.clear();
      } else {
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      }
    },
    [queryClient]
  );

  useEffect(() => {
    registerAuth({
      getAuth: () => ({
        accessToken,
        refreshToken,
      }),
      setAuth: (tokens: AuthTokens) => {
        setAccessTokenState(tokens.accessToken);
        setRefreshTokenState(tokens.refreshToken);
        if (tokens.accessToken) {
          queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        }
      },
      onUnauthorized: () => {
        setAccessTokenState(null);
        setRefreshTokenState(null);
        queryClient.clear();
        routerRef.current.replace("/login");
      },
    });
  }, [accessToken, refreshToken, queryClient]);

  const { data: currentUser } = useMe(accessToken);

  const logout = useCallback(async () => {
    const currentRefresh = refreshToken;
    if (currentRefresh) {
      try {
        const { getApiClient } = await import("../lib/apiClient");
        await getApiClient().post("/auth/logout", {
          refresh_token: currentRefresh,
        });
      } catch {
        // Proceed to clear client-side
      }
    }
    setTokens(null, null);
  }, [refreshToken, setTokens]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        currentUser: currentUser ?? null,
        setTokens,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
