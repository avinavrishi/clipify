"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

export type AuthModalTab = "login" | "register";
export type RegisterType = "creator" | "brand";

type AuthModalContextValue = {
  open: boolean;
  tab: AuthModalTab;
  registerType: RegisterType;
  openLogin: () => void;
  openRegisterCreator: () => void;
  openRegisterBrand: () => void;
  close: () => void;
  setTab: (tab: AuthModalTab) => void;
  setRegisterType: (type: RegisterType) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTabState] = useState<AuthModalTab>("login");
  const [registerType, setRegisterType] = useState<RegisterType>("creator");

  const openLogin = useCallback(() => {
    setTabState("login");
    setOpen(true);
  }, []);

  const openRegisterCreator = useCallback(() => {
    setTabState("register");
    setRegisterType("creator");
    setOpen(true);
  }, []);

  const openRegisterBrand = useCallback(() => {
    setTabState("register");
    setRegisterType("brand");
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const setTab = useCallback((t: AuthModalTab) => {
    setTabState(t);
  }, []);

  const setRegisterTypeState = useCallback((t: RegisterType) => {
    setRegisterType(t);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        open,
        tab,
        registerType,
        openLogin,
        openRegisterCreator,
        openRegisterBrand,
        close,
        setTab,
        setRegisterType: setRegisterTypeState,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
