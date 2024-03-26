import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'jalali-moment';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements :number = 0;

  previousKeyword:string = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListOfProducts();
    }
  }

  handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // then set thePageNumber to 1

    if(this.previousKeyword != keyword){
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;

    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`);

    // now search for products using keyword
    this.productService
      .SearchProductPaginate(this.pageNumber - 1,
                                   this.pageSize,
                                   keyword).subscribe(this.processResult());
  }



  processResult(){
    return (data: any) =>{
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }



  handleListOfProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      this.currentCategoryId = 1;
    }
    //
    // check if we have a different category id than previous
    // than set thePageNumber back to 1
    //

    // if we have a different category id than previous
    // then set pageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId)
      this.pageNumber = 1;

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`)



    this.productService
      .getProductListPaginate(this.pageNumber - 1,
                                    this.pageSize,
                                    this.currentCategoryId).subscribe(this.processResult());
  }


  updatePageSize(value: string) {
    this.pageSize = +value;
    this.pageNumber = 1;
    this.listProducts();
  }
  /////////////////////////////////////////////////////////////////
  convertToJalaliWithWeekday(miladiDate: Date): string {
    const jalaliDate = moment(miladiDate).subtract(1, 'day').locale('fa');
    const jalaliDay = jalaliDate.format('dddd');
    const jalaliDateNumber = jalaliDate.format('jYYYY/jMM/jDD');
    const jalaliDateString = jalaliDate.format('jYYYY/jMM/jDD dddd');
    // console.log(
    //   moment
    //     .from(jalaliDateString, 'fa', 'jYYYY/jMM/jDD dddd')
    //     .locale('en')
    //     .toDate()
    // );

    return `${jalaliDateNumber} ${jalaliDay}`;
  }

  /////////////////////////////////////////////////////////////////
  addToCard(tempProduct: Product) {
    console.log(`Adding to card ${tempProduct.name} ${tempProduct.unitPrice}`);

    const cartItem = new CartItem(tempProduct);

    this.cartService.addToCart(cartItem);
  }
}
