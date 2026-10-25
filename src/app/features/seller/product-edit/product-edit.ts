import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Category } from '../../../core/services/category/category';
import { Cloudinary } from '../../../core/services/cloudinary/cloudinary';
import { Product } from '../../../core/services/product/product';
import { CategoryResponse } from '../../../core/models/product/category-response.model';
import { ProductRequest } from '../../../core/models/product/product-request.model';
import { ProductResponse } from '../../../core/models/product/product-response.model';

@Component({
  selector: 'app-product-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css',
})
export class ProductEdit {
  private fb = inject(FormBuilder);
  private categoryService = inject(Category);
  private cloudinary = inject(Cloudinary);
  private productService = inject(Product);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories = signal<CategoryResponse[]>([]);
  imageUrls = signal<string[]>([]);
  isUploading = signal(false);
  isSubmitting = signal(false);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  private productId = signal<number | null>(null);

  productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.errorMessage.set('Invalid product id.');
      this.isLoading.set(false);
      return;
    }

    this.productId.set(id);

    forkJoin({
      categories: this.categoryService.getAllCategories(),
      product: this.productService.getProductById(id),
    }).subscribe({
      next: ({ categories, product }) => {
        const availableCategories = categories.content ?? [];
        this.categories.set(availableCategories);
        this.patchForm(product, availableCategories);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load product details.');
        this.isLoading.set(false);
      },
    });
  }

  private patchForm(product: ProductResponse, categories: CategoryResponse[]): void {
    const matchedCategory = categories.find(c => c.name === product.categoryName);

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: matchedCategory?.id ?? 0,
    });

    this.imageUrls.set((product.images ?? []).map(image => image.imageUrl));
  }

  onFilesSelected(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!files.length) return;

    this.isUploading.set(true);
    this.errorMessage.set(null);
    forkJoin(files.map(file => this.cloudinary.uploadImage(file))).subscribe({
      next: urls => {
        this.imageUrls.update(existing => [...existing, ...urls]);
        this.isUploading.set(false);
      },
      error: () => {
        this.errorMessage.set('Image upload failed. Please try again.');
        this.isUploading.set(false);
      },
    });
  }

  removeImage(index: number): void {
    this.imageUrls.update(urls => urls.filter((_, currentIndex) => currentIndex !== index));
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.isUploading() || !this.productId()) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    const request: ProductRequest = {
      ...value,
      imageUrls: this.imageUrls(),
    };

    this.isSubmitting.set(true);
    this.productService.updateProduct(this.productId()!, request).subscribe({
      next: () => this.router.navigate(['/seller/products']),
      error: () => {
        this.errorMessage.set('Product update failed. Please review the details and try again.');
        this.isSubmitting.set(false);
      },
    });
  }
}

