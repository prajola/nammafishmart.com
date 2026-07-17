import { createContext, useContext, useState, type ReactNode } from "react";

interface UI {
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}
const Ctx = createContext<UI | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [loginOpen, setLogin] = useState(false);
  const [cartOpen, setCart] = useState(false);
  return (
    <Ctx.Provider
      value={{
        loginOpen,
        openLogin: () => setLogin(true),
        closeLogin: () => setLogin(false),
        cartOpen,
        openCart: () => setCart(true),
        closeCart: () => setCart(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export function useUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
