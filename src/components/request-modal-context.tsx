import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ProductCtx = { id?: string; name: string; slug?: string } | null;

type Ctx = {
  open: boolean;
  product: ProductCtx;
  openModal: (product?: ProductCtx) => void;
  close: () => void;
};

const RequestModalCtx = createContext<Ctx | null>(null);

export function RequestModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<ProductCtx>(null);

  const openModal = useCallback((p?: ProductCtx) => {
    setProduct(p ?? null);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <RequestModalCtx.Provider value={{ open, product, openModal, close }}>
      {children}
    </RequestModalCtx.Provider>
  );
}

export function useRequestModal() {
  const ctx = useContext(RequestModalCtx);
  if (!ctx) throw new Error("useRequestModal outside provider");
  return ctx;
}
