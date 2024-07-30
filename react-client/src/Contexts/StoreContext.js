import React, { createContext, useEffect, useState, useMemo } from "react";
import { useAuth0 } from '@auth0/auth0-react'
import request from '../Services/request-service';

const api_url = process.env.REACT_APP_BACKEND_API_URL;

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const { user } = useAuth0();

    const getCartItems = () => {
        let cart = JSON.parse(localStorage.getItem("react-demos_cart")) || [];
        return cart;
    };

    const [products, setProducts] = useState([]); // TODO: please find below (**)
    const [categories, setCategories] = useState(undefined);
    const [allVariants, setAllVariants] = useState(undefined);
    const [cartItems, setCartItems] = useState(getCartItems());

    useEffect(() => {
        // Get Categories
        request.get(`${api_url}/categories`)
            .then(response => { setCategories(response.data) })
            .catch(error => { console.error(error); })
        // Get Variants for all Categories
        request.get(`${api_url}/categories/variants`)
            .then(response => { setAllVariants(response.data) })
            .catch(error => { console.error(error); })
        // Get Products // (**) TODO: DO NOT FETCH THIS HERE, BUT IMPLEMENT AN ENDPOINT FOR MULTIPLE PRODUCTS
        request.get(`${api_url}/products`)
            .then(response => { setProducts(response.data) })
            .catch(error => { console.error(error); })
    }, [])


    const fetchProduct = async (mp_id) => {
        return request.get(`${api_url}/products/${mp_id}`)
            .then(response => {
                return (response.data)
            })
            .catch(error => {
                console.error(error);
                return (JSON.stringify(error));
            })
    }

    const fetchProductBatch = async (limit, offset) => {
        let url = `${api_url}/products-new`;
        url += `?limit=${limit}&offset=${offset}`;

        return request.get(url)
            .then(response => {
                return (response.data)
            })
            .catch(error => {
                console.error(error);
                return (JSON.stringify(error));
            })
    }

    const fetchProductsByCategory = async (pc_id) => {
        return request.get(`${api_url}/products/category/${pc_id}`)
            .then(response => {
                return (response.data)
            })
            .catch(error => {
                console.error(error);
                return (JSON.stringify(error));
            })
    }

    const getVariantsByCategory = (allVariants, pc_id) => {
        // try {
        //     return allVariants.find(v => v.pc_id == pc_id)['variants']
        // } catch (error) {
        //     return []
        // }
        if (allVariants[pc_id]) {
            return allVariants[pc_id]['variants']
        }
        return undefined;
    }

    const cartItemsDisplay = useMemo(() => {
        if (products.length > 0) {
            try {
                return (
                    cartItems.map((cartItem) => {
                        let product = products.find(product => product.mp_id === Number(cartItem.mp_id));
                        const variants = getVariantsByCategory(allVariants, product.mp_pc_id);
                        let variant = variants.find(variant => variant.pv_id === Number(cartItem.pv_id));
                        return {
                            ...product,
                            ...variant,
                            quantity: cartItem.quantity,
                        }
                    })
                )
            } catch (error) { }
        } else {
            return null;
        }
    }, [cartItems, products, allVariants]);

    const getTotalCartPrice = () => {
        let totalPrice = 0;
        for (const item of cartItems) {
            try {
                let product = products.find((product) => product.mp_id === Number(item.mp_id));
                totalPrice += item.quantity * product.mp_price;
            } catch (error) { }
        }
        return totalPrice.toFixed(2);
    };

    const getAmountCartItems = () => {
        let amountItems = 0;
        for (const item of cartItems) {
            amountItems += Number(item.quantity)
        }
        return amountItems;
    };

    const addToCart = (mp_id, pv_id) => {
        if (true) { // TODO: change this to if (!user)

            // Check if the product with the same variant already exists in the cart
            const index = cartItems.findIndex(
                (item) => item.mp_id === mp_id && item.pv_id === pv_id
            );

            let newCartItems = [...cartItems];
            if (index !== -1) {
                // If the product with the same variant exists, increment the quantity
                const newCartItem = {
                    ...cartItems[index],
                    quantity: cartItems[index].quantity + 1,
                };
                newCartItems.splice(index, 1, newCartItem);
            } else {
                const newCartItem = {
                    mp_id: mp_id,
                    pv_id: pv_id,
                    quantity: 1,
                };
                // If the product with the same variant does not exist, add the new cart item
                newCartItems.push(newCartItem);
            }

            // Save the updated cart items to cartItems and to local storage
            setCartItems(newCartItems)
            localStorage.setItem("react-demos_cart", JSON.stringify(newCartItems));
        }
    };

    const removeFromCart = (mp_id, pv_id) => {

        const index = cartItems.findIndex(
            (item) => item.mp_id === mp_id && item.pv_id === pv_id
        );

        console.log(mp_id, pv_id);
        console.log(index);
        console.log(cartItems[index]);
        let newCartItems = [...cartItems];
        if (cartItems[index].quantity == 1) {
            // Delete the entry from the cart
            newCartItems.splice(index, 1);
        } else {
            // Decrement the quantity
            const newCartItem = {
                ...cartItems[index],
                quantity: cartItems[index].quantity - 1,
            };
            newCartItems.splice(index, 1, newCartItem);
        }
        // Save the updated cart items to cartItems and to local storage
        setCartItems(newCartItems)
        localStorage.setItem("react-demos_cart", JSON.stringify(newCartItems));
    };

    const emptyCart = () => {
        setCartItems([]);
        localStorage.removeItem("react-demos_cart");
    }

    const contextValue = {
        products, fetchProduct, fetchProductBatch, fetchProductsByCategory, categories, allVariants, getVariantsByCategory,
        cartItems, cartItemsDisplay, getAmountCartItems, getTotalCartPrice, addToCart, removeFromCart, emptyCart,
    };
    return (
        <StoreContext.Provider value={contextValue}>
            {/* {JSON.stringify(cartItems)} */}
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
