import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {
  }


  addToCart(cartItem: CartItem) {
    // check if we already have the item to our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id

      // check if we found it
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);

      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) existingCartItem!.quantity++;
    else
      this.cartItems.push(cartItem);

    // compute cart total price and total quantity
    this.computeCartTotals();

  }

  computeCartTotals() {

    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    this.cartItems.forEach(cartItem => {
      totalPriceValue += cartItem.unitPrice * cartItem.quantity;
      totalQuantityValue += cartItem.quantity;
    });

    // publish the new values ... all subscribers with receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('============')
  }

  decrementQuantity(tempCartItem: CartItem) {
    tempCartItem.quantity--;
    if(tempCartItem.quantity === 0)
      this.remove(tempCartItem);
    else
      this.computeCartTotals();
  }

  remove(tempCartItem: CartItem) {
    // get index of item in array
    const itemIndex = this.cartItems.findIndex
    (
      item => item.id === tempCartItem.id);

    // if found, remove the item from array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
