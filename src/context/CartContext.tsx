"use client"; // This tells Next.js this file runs in the browser, not the server

// =====================================================
// CART CONTEXT
// =====================================================
// React Context is a way to share data across your entire app WITHOUT
// having to pass it as props through every component manually.
//
// PROBLEM without Context:
//   App → Layout → Navbar → CartIcon (needs cart count)
//   App → ProductCard (needs "add to cart" function)
//   App → CartPage (needs all cart items)
//   You'd have to pass cart data as props through EVERY component in between.
//   This is called "prop drilling" and gets messy fast.
//
// SOLUTION with Context:
//   Create a "store" at the top level.
//   Any component anywhere in the tree can read from or write to it directly.
//   It's like a shared global variable, but in a React-safe way.
//
// HOW IT WORKS:
//   1. createContext()   → Creates the "container" for our shared state
//   2. Provider          → Wraps our app and makes the data available
//   3. useContext()      → Any component can "subscribe" and get the data

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/types";

// --- SHAPE OF OUR CART STATE ---
// This interface describes exactly what data lives in the cart context.
interface CartState {
  items: CartItem[];
  isOpen: boolean; // Controls whether the cart drawer is visible
}

// --- ACTIONS ---
// In a "reducer" pattern, we describe WHAT happened (action),
// and the reducer function decides HOW the state changes.
// This makes state changes predictable and easy to debug.
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; size: string; color: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; size: string; color: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

// --- CONTEXT TYPE ---
// Everything the context will expose to components.
interface CartContextType {
  state: CartState;
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  // Computed values — calculated from items, not stored separately
  itemCount: number;
  subtotal: number;
}

// --- INITIAL STATE ---
const initialState: CartState = {
  items: [],
  isOpen: false,
};

// --- REDUCER FUNCTION ---
// A reducer takes the CURRENT state and an ACTION, and returns the NEW state.
// It NEVER mutates the existing state — it always returns a fresh copy.
// This is the "pure function" pattern: same inputs → always same output.
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART":
      // Restore cart from localStorage on app start
      return { ...state, items: action.payload };

    case "ADD_ITEM": {
      const { product, quantity, selected_size, selected_color } = action.payload;
      // Check if this exact product+size+color combo already exists
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selected_size === selected_size &&
          item.selected_color === selected_color
      );

      if (existingIndex >= 0) {
        // Already in cart — just increase the quantity
        const updatedItems = [...state.items]; // Create a copy (don't mutate!)
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return { ...state, items: updatedItems };
      }

      // New item — add to the end of the array
      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      // `filter` returns a NEW array without the matched item
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.product.id === action.payload.productId &&
              item.selected_size === action.payload.size &&
              item.selected_color === action.payload.color
            )
        ),
      };

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        // Quantity of 0 or less = remove the item
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === action.payload.productId &&
                item.selected_size === action.payload.size &&
                item.selected_color === action.payload.color
              )
          ),
        };
      }
      // `map` returns a NEW array, updating only the matched item
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.productId &&
          item.selected_size === action.payload.size &&
          item.selected_color === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

// --- CREATE THE CONTEXT ---
// We pass `undefined` as the default — the actual value comes from the Provider.
// The `!` in useCartContext() below ensures we always use it inside the Provider.
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
// This wraps our entire app (in layout.tsx) and makes cart data available everywhere.
// `children` is everything nested inside <CartProvider>...</CartProvider>
export function CartProvider({ children }: { children: ReactNode }) {
  // `useReducer` is like `useState` but for complex state with multiple update types.
  // It returns [currentState, dispatchFunction]
  // `dispatch` sends an action to the reducer to update state.
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // PERSIST TO LOCALSTORAGE
  // On first load, restore the cart from localStorage (so it survives page refreshes)
  useEffect(() => {
    const stored = localStorage.getItem("mensworld_cart");
    if (stored) {
      try {
        const items = JSON.parse(stored) as CartItem[];
        dispatch({ type: "LOAD_CART", payload: items });
      } catch {
        // If localStorage data is corrupted, start fresh
        localStorage.removeItem("mensworld_cart");
      }
    }
  }, []); // Empty array = runs only once when the component first mounts

  // Save to localStorage whenever the cart items change
  useEffect(() => {
    localStorage.setItem("mensworld_cart", JSON.stringify(state.items));
  }, [state.items]); // Runs every time `state.items` changes

  // HELPER FUNCTIONS
  // These wrap `dispatch` in friendly named functions.
  // Components call addItem() instead of having to know about dispatch/actions.
  const addItem = (
    product: Product,
    size: string,
    color: string,
    quantity = 1
  ) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { product, quantity, selected_size: size, selected_color: color },
    });
  };

  const removeItem = (productId: string, size: string, color: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, size, color } });
  };

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, color, quantity } });
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  // COMPUTED VALUES
  // These are calculated on the fly from state.items — not stored separately.
  // `reduce` loops through all items and accumulates a single value.
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        closeCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// --- CUSTOM HOOK ---
// Instead of writing `useContext(CartContext)` in every component,
// we export this small hook. It also throws a helpful error if you
// accidentally use it outside the Provider.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>. Check your layout.tsx.");
  }
  return context;
}
