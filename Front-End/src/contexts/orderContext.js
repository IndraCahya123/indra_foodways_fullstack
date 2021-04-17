import { createContext, useReducer } from 'react';

export const OrderContext = createContext();

const initialValues = {
  restaurant: "",
  restaurantLoc: "",
    orders: [],
}

const reducer = (state, action) => {
    const {type, payload} = action;

    switch (type) {
        case "ADD_PRODUCT_TO_CART":
            const findOrderById = state.orders.find(
                (product) => product.id === payload.product.id
              );
        
              if (findOrderById) {
                const updatedOrders = state.orders.map((product) =>
                  product.id === payload.product.id
                    ? {
                        ...product,
                        qty: product.qty + 1,
                      }
                    : product
                );
        
                return {
                  ...state,
                  orders: updatedOrders,
                };
              }
        
              return {
                ...state,
                restaurant: payload.restaurant,
                restaurantLoc: payload.restaurantLoc,
                orders: [ 
                  ...state.orders,
                  {
                    ...payload.product,
                    qty: 1,
                  },
                ],
            };
        case "REMOVE_PRODUCT":
        const filteredOrders = state.orders.filter(
          (product) => product.id !== payload.id
        );

        if (state.orders.length === 1) {
          return {
            ...state,
            restaurant: "",
            restaurantLoc: "",
            orders: filteredOrders,
          }   
        } else {
          return {
            ...state,
            orders: filteredOrders,
          }
        };
        
      case "DECREASE_QTY":
        const findProductById = state.orders.find(
          product => product.id === payload.id
        );
        
        const updatedOrders = state.orders.map((product) =>
              product.id === findProductById.id
                ? {
                    ...product,
                    qty: product.qty - 1,
                  }
                : product
            );
    
        return {
          ...state,
          orders: updatedOrders,
        };
      
      case "INCREASE_QTY":
        const findProduct = state.orders.find(
          product => product.id === payload.id
        );
        
        const updateOrders = state.orders.map((product) =>
              product.id === findProduct.id
                ? {
                    ...product,
                    qty: product.qty + 1,
                  }
                : product
            );
    
        return {
          ...state,
          orders: updateOrders,
        };
      
      case "CHANGE_RESTAURANT":
      case "CHECKOUT_ORDERS":
        return {
          ...state,
          restaurant: "",
          restaurantLoc: "",
          orders: []
        }
    
        default:
            throw new Error();
    }
}

export const OrderContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialValues);

    return (
        <OrderContext.Provider value={[state, dispatch]}>
            {children}
        </OrderContext.Provider>
    );
}