import { useState, ReactNode, createContext } from 'react';

// ✅ Use a different name for the type to avoid naming conflict
type SidebarContextType = {
  sidebarToggle: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

// ✅ Create the context using the renamed type
export const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType
);

// ✅ Props type for the provider
type Props = {
  children: ReactNode;
};

// ✅ SidebarProvider component
export function SidebarProvider({ children }: Props) {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  return (
    <SidebarContext.Provider
      value={{ sidebarToggle, toggleSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
