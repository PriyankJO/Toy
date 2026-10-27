import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    shippingFee: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend if authenticated
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Local storage guest cart
      const savedGuestCart = localStorage.getItem('toywonder_guest_cart');
      if (savedGuestCart) {
        try {
          const parsed = JSON.parse(savedGuestCart);
          setCart(parsed);
        } catch {
          setCart({ items: [], totalItems: 0, subtotal: 0, shippingFee: 0, total: 0 });
        }
      }
      return;
    }

    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Recalculate guest cart helper
  const updateGuestCart = (newItems) => {
    let subtotal = 0;
    let totalItems = 0;
    newItems.forEach((item) => {
      const price = item.product.discountPrice || item.product.price;
      subtotal += price * item.quantity;
      totalItems += item.quantity;
    });
    const shippingFee = subtotal > 499 || subtotal === 0 ? 0 : 50;
    const total = subtotal + shippingFee;

    const newCart = { items: newItems, totalItems, subtotal, shippingFee, total };
    setCart(newCart);
    localStorage.setItem('toywonder_guest_cart', JSON.stringify(newCart));
  };

  const addToCart = async (product, quantity = 1) => {
    if (product.stock < quantity) {
      toast.error(`Sorry, only ${product.stock} items in stock!`);
      return false;
    }

    if (isAuthenticated) {
      try {
        const res = await cartService.addToCart(product._id, quantity);
        if (res.success && res.cart) {
          setCart(res.cart);
          toast.success(`${product.name} added to cart!`);
          return true;
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not add product to cart');
        return false;
      }
    } else {
      // Guest cart flow
      const existingIndex = cart.items.findIndex(
        (i) => i.product._id === product._id
      );
      let newItems = [...cart.items];

      if (existingIndex > -1) {
        const newQty = newItems[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          toast.error(`Cannot add more. You have ${newItems[existingIndex].quantity} in cart and stock is ${product.stock}.`);
          return false;
        }
        newItems[existingIndex].quantity = newQty;
        newItems[existingIndex].itemTotal = (product.discountPrice || product.price) * newQty;
      } else {
        newItems.push({
          _id: `guest_${Date.now()}_${Math.random()}`,
          product: {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            discountPrice: product.discountPrice,
            effectivePrice: product.discountPrice || product.price,
            image: product.images[0],
            stock: product.stock,
            SKU: product.SKU
          },
          quantity,
          itemTotal: (product.discountPrice || product.price) * quantity
        });
      }

      updateGuestCart(newItems);
      toast.success(`${product.name} added to cart!`);
      return true;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.updateQuantity(itemId, quantity);
        if (res.success && res.cart) {
          setCart(res.cart);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update quantity');
      }
    } else {
      let newItems = [...cart.items];
      if (quantity <= 0) {
        newItems = newItems.filter((i) => i._id !== itemId);
      } else {
        const item = newItems.find((i) => i._id === itemId);
        if (item) {
          if (quantity > item.product.stock) {
            toast.error(`Only ${item.product.stock} items available`);
            return;
          }
          item.quantity = quantity;
          item.itemTotal = (item.product.discountPrice || item.product.price) * quantity;
        }
      }
      updateGuestCart(newItems);
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.removeItem(itemId);
        if (res.success && res.cart) {
          setCart(res.cart);
          toast.success('Item removed from cart');
        }
      } catch (err) {
        toast.error('Failed to remove item');
      }
    } else {
      const newItems = cart.items.filter((i) => i._id !== itemId);
      updateGuestCart(newItems);
      toast.success('Item removed from cart');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setCart({ items: [], totalItems: 0, subtotal: 0, shippingFee: 0, total: 0 });
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.removeItem('toywonder_guest_cart');
      setCart({ items: [], totalItems: 0, subtotal: 0, shippingFee: 0, total: 0 });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
