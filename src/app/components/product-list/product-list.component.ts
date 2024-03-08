import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'jalali-moment';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number | undefined;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    });
  }

  listProduct() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      this.currentCategoryId = 1;
    }

    this.productService
      .getProductList(this.currentCategoryId)
      .subscribe((data) => (this.products = data));
  }
  /////////////////////////////////////////////////////////////////
  convertToJalaliWithWeekday(miladiDate: Date): string {
    const jalaliDate = moment(miladiDate).subtract(1, 'day').locale('fa');
    const jalaliDay = jalaliDate.format('dddd');
    const jalaliDateNumber = jalaliDate.format('jYYYY/jMM/jDD');
    const jalaliDateString = jalaliDate.format('jYYYY/jMM/jDD dddd');
    console.log(
      moment
        .from(jalaliDateString, 'fa', 'dddd، jYYYY/jMM/jDD')
        .locale('en')
        .toDate()
    );

    return `${jalaliDateNumber} ${jalaliDay}`;
  }
  /////////////////////////////////////////////////////////////////
}
