import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";
import {beforeRead} from "@popperjs/core";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() { }


  addToCart(cartItem: CartItem){
    // check if we already have the item to our cart
    let alreadyExistsInCart:boolean = false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length > 0){
      // find the item in the cart based on item id

      // check if we found it
      this.cartItems.forEach(tempCartItem =>{
        if(tempCartItem.id === cartItem.id){
          existingCartItem = tempCartItem;
          alreadyExistsInCart = true;
        }
      });

      if(alreadyExistsInCart)
        existingCartItem.quantity++;
      else
        this.cartItems.push(cartItem);
    }
  }
}
