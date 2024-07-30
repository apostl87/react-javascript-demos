import React, { useContext, useMemo } from "react";
import "../../css/cartitems.css";
import deleteIcon from "../../assets/cart_delete_icon.svg";
import { StoreContext } from "../../Contexts/StoreContext";
import { currency } from "../../Views/Store"

const CartItems = () => {
  const { products } = useContext(StoreContext);
  const { cartItemsDisplay, removeFromCart, emptyCart, getTotalCartPrice } = useContext(StoreContext);

  if (!cartItemsDisplay || cartItemsDisplay.length === 0) {
    return (
      <div className="text-center mt-5 min-h-screen">
        Your cart is empty.
      </div>
    )
  }

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p></p>
        <p>Title</p>
        <p className="text-center">Variant</p>
        <p className="text-right">Price</p>
        <p className="text-center">Quantity</p>
        <p></p>
        <p className="text-right">Total</p>
      </div>
      <hr />
      {cartItemsDisplay.map((item, index) => {
        return (
          <div key={index}>
            <div className="cartitems-format-main cartitems-format">
              <img className="cartitems-product-icon" src={item.mp_image_url} alt="" />
              <p className="cartitems-product-title">{item.mp_name}</p>
              <p className="text-center">{item.pv_variant_name}</p>
              <p className="text-right">{item.mp_currency} {item.mp_price}</p>
              <p className="flex justify-center">
                <input className="cartitems-quantity text-center" value={item.quantity} disabled />
              </p>
              <p className="flex justify-center cursor-pointer">
                <img src={deleteIcon}
                      onClick={() => removeFromCart(item.mp_id, item.pv_id)}
                      className="cartitems-remove-icon" />
              </p>
              <p className="text-right font-semibold">{item.mp_currency} {(item.mp_price * item.quantity).toFixed(2)}</p>
              {/* <img onClick={() => { removeFromCart(e.id) }} className="cartitems-remove-icon" src={e} alt="" /> */}
            </div>
            <hr />
          </div>
        )
      }
      )}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{currency} {getTotalCartPrice()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{currency} {getTotalCartPrice()}</h3>
            </div>
          </div>
          <button className="self-end rounded-2xl bg-emerald-200 hover:bg-emerald-300 w-full max-w-52 h-14 py-2 font-semibold">
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cartitems-promocode">
          {/* <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div> */}
        </div>
        <div className="cartitems-empty-cart">
          <button
            className="rounded-2xl bg-gray-400 hover:bg-gray-300 w-full max-w-52 h-12 py-2 font-semibold text-black px-5
                      flex items-center gap-2"
            onClick={emptyCart}>
            <img src={deleteIcon} />
            Empty Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
