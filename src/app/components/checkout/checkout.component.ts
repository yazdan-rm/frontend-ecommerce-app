import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

   checkoutFormGroup!:FormGroup ;
   totalPrice: number = 0;
   totalQuantity: number = 0;



  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:[''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street:[''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode:['']
      }),
      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear:['']
      })
    })
  }


  onsubmit() {
    console.log(`Handling the submit button`);
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('customer')?.value.firstName);
    console.log(this.checkoutFormGroup.get('customer')?.value.lastName);
    console.log(this.checkoutFormGroup.get('customer')?.value.email);
    console.log(this.checkoutFormGroup.value);
  }

  copyShippingAddressToBillingAddress(event:any) {
    console.log(event.target.checked);
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].
          setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
}
