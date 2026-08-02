import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AppContext = createContext();

const ACTION_TYPES = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY'
};

const initialState = {
  user: null,
  isLoading: false,
  products: [],
  cart: [],
  apiStatus: 'checking'
};

const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload };
    
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ACTION_TYPES.SET_PRODUCTS:
      return { ...state, products: action.payload };
    
    case ACTION_TYPES.ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        };
      }
      return { 
        ...state, 
        cart: [...state.cart, { ...action.payload, quantity: action.payload.quantity || 1 }] 
      };
    
    case ACTION_TYPES.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case ACTION_TYPES.UPDATE_CART_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case ACTION_TYPES.CLEAR_CART:
      return { ...state, cart: [] };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),
    setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setProducts: (products) => dispatch({ type: ACTION_TYPES.SET_PRODUCTS, payload: products }),
    addToCart: (product, quantity = 1) => dispatch({ 
      type: ACTION_TYPES.ADD_TO_CART, 
      payload: { ...product, quantity } 
    }),
    removeFromCart: (productId) => dispatch({ 
      type: ACTION_TYPES.REMOVE_FROM_CART, 
      payload: productId 
    }),
    updateCartQuantity: (productId, quantity) => dispatch({
      type: ACTION_TYPES.UPDATE_CART_QUANTITY,
      payload: { productId, quantity }
    }),
    clearCart: () => dispatch({ type: ACTION_TYPES.CLEAR_CART })
  };

  // محاسبات derived state
  const cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = state.cart.reduce((count, item) => count + item.quantity, 0);

  // بارگذاری اولیه محصولات
  useEffect(() => {
    const initializeApp = async () => {
      try {
        actions.setLoading(true);
        
        // بررسی سلامت API
        const healthResponse = await apiService.health.check();
        console.log('API Health:', healthResponse.data);
        
        // دریافت محصولات
        const productsResponse = await apiService.products.getAll();
        const products = productsResponse.data.data?.products || productsResponse.data.products || [];
        actions.setProducts(products);
        
      } catch (error) {
        console.error('Error initializing app:', error);
        // استفاده از محصولات نمونه در صورت خطا
        const sampleProducts = [
          {
            id: 1,
            name: 'لپ‌تاپ گیمینگ',
            price: 25000000,
            category: 'الکترونیک',
            stock: 15,
            featured: true
          },
          {
            id: 2,
            name: 'هدفون بی‌سیم',
            price: 3500000,
            category: 'صوتی', 
            stock: 30,
            featured: true
          }
        ];
        actions.setProducts(sampleProducts);
      } finally {
        actions.setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const value = {
    ...state,
    ...actions,
    cartTotal,
    cartItemsCount,
    formattedCartTotal: cartTotal.toLocaleString()
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
