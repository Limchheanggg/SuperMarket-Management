import { createContext, useContext, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  const toastRef = useRef({});

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (id) => wishlist.some((p) => p.Product_ID === id);

  const addToWishlist = (product) => {
    const key = `wish_${product.Product_ID}`;
    if (toastRef.current[key]) return;
    toastRef.current[key] = true;
    setTimeout(() => {
      toastRef.current[key] = false;
    }, 600);

    setWishlist((prev) => {
      if (prev.find((p) => p.Product_ID === product.Product_ID)) {
        toast("Already in wishlist!", { icon: "💛" });
        return prev;
      }
      toast.success(`${product.Name} added to wishlist ❤️`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.Product_ID === id);
      if (!exists) return prev;
      toast("Removed from wishlist", { icon: "🗑️" });
      return prev.filter((p) => p.Product_ID !== id);
    });
  };

  const toggleWishlist = (product) => {
    // Check current state synchronously from the ref-like pattern
    setWishlist((prev) => {
      const exists = prev.find((p) => p.Product_ID === product.Product_ID);
      const key = `wish_${product.Product_ID}`;

      if (toastRef.current[key]) return prev; // block double-render
      toastRef.current[key] = true;
      setTimeout(() => {
        toastRef.current[key] = false;
      }, 600);

      if (exists) {
        toast("Removed from wishlist", { icon: "🗑️" });
        return prev.filter((p) => p.Product_ID !== product.Product_ID);
      } else {
        toast.success(`${product.Name} added to wishlist ❤️`);
        return [...prev, product];
      }
    });
  };

  const totalWishlist = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        totalWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
