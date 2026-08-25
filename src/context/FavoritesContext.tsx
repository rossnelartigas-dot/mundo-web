"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
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

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const FAVORITES_STORAGE_KEY = "favorites";
const EMPTY_FAVORITES: Product[] = [];

let memoryFavorites: Product[] = EMPTY_FAVORITES;
let isInitialized = false;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function initMemoryFavorites() {
  if (isInitialized || typeof window === "undefined") return;
  try {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      if (Array.isArray(parsedFavorites)) {
        memoryFavorites = parsedFavorites;
      }
    }
  } catch (error) {
    console.error("Error cargando favoritos:", error);
  }
  isInitialized = true;
}

function getSnapshot(): Product[] {
  if (!isInitialized) {
    initMemoryFavorites();
  }
  return memoryFavorites;
}

function getServerSnapshot(): Product[] {
  return EMPTY_FAVORITES;
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === FAVORITES_STORAGE_KEY) {
      try {
        memoryFavorites = e.newValue
          ? JSON.parse(e.newValue)
          : EMPTY_FAVORITES;
      } catch {
        memoryFavorites = EMPTY_FAVORITES;
      }
      emitChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function setFavoritesState(newFavorites: Product[]) {
  memoryFavorites = newFavorites;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
    } catch (error) {
      console.error("Error guardando favoritos:", error);
    }
  }
  emitChange();
}

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const addToFavorites = useCallback((product: Product) => {
    const current = getSnapshot();
    const exists = current.some((item) => item.id === product.id);

    if (exists) {
      return;
    }

    setFavoritesState([...current, product]);
  }, []);

  const removeFromFavorites = useCallback((id: number) => {
    const current = getSnapshot();
    setFavoritesState(current.filter((item) => item.id !== id));
  }, []);

  const toggleFavorite = useCallback((product: Product) => {
    const current = getSnapshot();
    const exists = current.some((item) => item.id === product.id);

    if (exists) {
      setFavoritesState(current.filter((item) => item.id !== product.id));
    } else {
      setFavoritesState([...current, product]);
    }
  }, []);

  const isFavorite = useCallback(
    (id: number) => {
      return favorites.some((item) => item.id === id);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavoritesState([]);
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
    }),
    [
      favorites,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe usarse dentro de FavoritesProvider"
    );
  }

  return context;
}