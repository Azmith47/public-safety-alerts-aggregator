"use client";

import { createContext, useState, type ReactNode } from 'react';

interface MenuContextValue {
  menuOpen: boolean;
  modalOpen: string | null;
  toggleMenu: ( menuOpen: boolean, modalName: string | null) => void;
}

// 1. Create the context with an optional default value
export const MenuContext = createContext<MenuContextValue>({
  menuOpen: false,
  modalOpen: null,
  toggleMenu: () => {},
});

interface MenuProviderProps {
  children: ReactNode;
}

export function MenuProvider({ children }: MenuProviderProps) {
    //State variables
    const [menuOpen, setMenuOpen] = useState(false); //belongs menu (opened via hamburger icon)
    const [modalOpen, setModalOpen] = useState<string | null>(null); //modalOpen can be null or a string

    const toggleMenu = ( menuOpen: boolean, modalName: string | null) => {
        setMenuOpen(menuOpen);
        if (modalName) {
            setModalOpen(modalName);
        } else {
            setModalOpen(null);
        }
    }

  // 2. Provide the state and modifier function to children
  return (
    <MenuContext.Provider value={{ menuOpen, modalOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
}