import {Component, inject, OnInit, signal} from '@angular/core';
import {ProductCard} from "../../shared/components/product-card/product-card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Product} from '../../core/services/product/product';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../core/services/category/category';
import {ProductResponse} from '../../core/models/product/product-response.model';
import {CategoryResponse} from '../../core/models/product/category-response.model';

@Component({
  selector: 'app-catalog',
  imports: [
    ProductCard,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit{

  public product = inject(Product);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public categoryService = inject(Category);

  minPrice: number | null = null;
  maxPrice: number | null = null;
  CategoryId: number | null = null;

  productList = signal<ProductResponse[]>([]);
  categoryList = signal<CategoryResponse[]>([]);

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categoryList.set(data.content),
      error: (err) => console.error('Failed to fetch categories', err)
    });
    this.route.queryParams.subscribe(params => {
      const searchTerm = params['name'];
      const minPrice = params['minPrice'];
      const maxPrice = params['maxPrice'];
      const categoryId = params['categoryId'];

      this.CategoryId = categoryId ? Number(categoryId) : null;
      this.minPrice = minPrice ? Number(minPrice) : null;
      this.maxPrice = maxPrice ? Number(maxPrice) : null;

      if (searchTerm || minPrice || maxPrice || categoryId) {
        this.product.searchProduct(searchTerm,categoryId,minPrice,maxPrice).subscribe({
          next: (data) => {
            this.productList.set(data.content);
          },
          error: (err) => {
            console.error('Failed to search products', err);
          }
        });
      } else {
        this.product.getAllProducts().subscribe({
          next: (data) => {
            this.productList.set(data.content);
          },
          error: (err) => {
            console.error('Failed to fetch products', err);
          }
        });
      }
    });
  }
  applyFilters(): void {
    const queryParams: any = {};
    const currentName = this.route.snapshot.queryParamMap.get('name');
    if (currentName) {
      queryParams.name = currentName;
    }

    if (this.minPrice) queryParams.minPrice = this.minPrice;
    if (this.maxPrice) queryParams.maxPrice = this.maxPrice;
    if (this.CategoryId) queryParams.categoryId = this.CategoryId;

    this.router.navigate(['/catalog'], { queryParams });
  }
}
