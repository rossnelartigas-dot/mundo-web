"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Product } from "@/types/product";

interface FavoritesContextType {
  favorites: Product[];

  addToFavorites: (product: Product) => void;

  removeFromFavorites: (id: number) => void;

  toggleFavorite: (product: Product) => void;

  isFavorite: (id: number) => boolean;

  clearFavorites: () => void;
}

const FavoritesContext =
  createContext<FavoritesContextType | undefined>(
    undefined
  );

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const savedFavorites =
        localStorage.getItem("favorites");

      if (!savedFavorites) {
        return [];
      }

      const parsedFavorites =
        JSON.parse(savedFavorites);

      if (!Array.isArray(parsedFavorites)) {
        return [];
      }

      return parsedFavorites as Product[];
    } catch (error) {
      console.error(
        "Error cargando favoritos:",
        error
      );

      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  function addToFavorites(product: Product) {
    setFavorites((current) => {
      const exists = current.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return current;
      }

      return [
        ...current,
        product,
      ];
    });
  }

  function removeFromFavorites(id: number) {
    setFavorites((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  function toggleFavorite(product: Product) {
    setFavorites((current) => {
      const exists = current.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return current.filter(
          (item) => item.id !== product.id
        );
      }

      return [
        ...current,
        product,
      ];
    });
  }

  function isFavorite(id: number) {
    return favorites.some(
      (item) => item.id === id
    );
  }

  function clearFavorites() {
    setFavorites([]);
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context =
    useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe usarse dentro de FavoritesProvider"
    );
  }

  return context;
}