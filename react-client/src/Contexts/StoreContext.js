import React, { createContext, useEffect, useState } from "react";
import request from '../Services/request-service';

const api_url = process.env.REACT_APP_BACKEND_API_URL;

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const getCartItems = () => {
        let cart = {};
        // for (let i = 0; i < 300; i++) {
        //   cart[i] = 0;
        // }
        return cart;
    };

    const [categories, setCategories] = useState([]);
    const [cartItems, setCartItems] = useState(getCartItems());

    useEffect(() => {
        // Get Categories
        request.get(`${api_url}/categories`)
            .then(response => { setCategories(response.data) })
            .catch(error => { console.error(error); })
    }, [])

    const getProductsByCategory = (category_id) => {
        request.get(`${api_url}/products/${category_id}`)
            .then(response => { return(response.data) })
            .catch(error => {
                console.error(error);
                return(JSON.stringify(error));
            })
    }

    //   const getTotalCartAmount = () => {
    //     let totalAmount = 0;
    //     for (const item in cartItems) {
    //       if (cartItems[item] > 0) {
    //         try {
    //           let itemInfo = products.find((product) => product.id === Number(item));
    //           totalAmount += cartItems[item] * itemInfo.new_price;
    //         } catch (error) {}
    //       }
    //     }
    //     return totalAmount;
    //   };

    //   const getTotalCartItems = () => {
    //     let totalItem = 0;
    //     for (const item in cartItems) {
    //       if (cartItems[item] > 0) {
    //         try {
    //           let itemInfo = products.find((product) => product.id === Number(item));
    //           totalItem += itemInfo ? cartItems[item] : 0 ;
    //         } catch (error) {}
    //       }
    //     }
    //     return totalItem;
    //   };

    //   const addToCart = (itemId) => {
    //     if (!localStorage.getItem("auth-token")) {
    //       alert("Please Login");
    //       return;
    //     }
    //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    //     if (localStorage.getItem("auth-token")) {
    //       fetch(`${backend_url}/addtocart`, {
    //         method: 'POST',
    //         headers: {
    //           Accept: 'application/form-data',
    //           'auth-token': `${localStorage.getItem("auth-token")}`,
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ "itemId": itemId }),
    //       })
    //     }
    //   };

    //   const removeFromCart = (itemId) => {
    //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    //     if (localStorage.getItem("auth-token")) {
    //       fetch(`${backend_url}/removefromcart`, {
    //         method: 'POST',
    //         headers: {
    //           Accept: 'application/form-data',
    //           'auth-token': `${localStorage.getItem("auth-token")}`,
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ "itemId": itemId }),
    //       })
    //     }
    //   };

    const contextValue = { getProductsByCategory, categories, cartItems }; //, addToCart, removeFromCart, getTotalCartItems, getTotalCartAmount };
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
