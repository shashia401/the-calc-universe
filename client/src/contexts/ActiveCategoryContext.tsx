import { createContext, useContext, useState, type ReactNode } from "react";

interface ActiveCategoryContextType {
  activeScrollCategory: string;
  setActiveScrollCategory: (category: string) => void;
}

const ActiveCategoryContext = createContext<ActiveCategoryContextType | null>(null);

export function ActiveCategoryProvider({ children }: { children: ReactNode }) {
  const [activeScrollCategory, setActiveScrollCategory] = useState<string>("");

  return (
    <ActiveCategoryContext.Provider value={{ activeScrollCategory, setActiveScrollCategory }}>
      {children}
    </ActiveCategoryContext.Provider>
  );
}

export function useActiveCategory() {
  const context = useContext(ActiveCategoryContext);
  if (!context) {
    throw new Error("useActiveCategory must be used within an ActiveCategoryProvider");
  }
  return context;
}
