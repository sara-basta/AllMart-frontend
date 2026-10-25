import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Category } from '../../../core/services/category/category';
import { Cloudinary } from '../../../core/services/cloudinary/cloudinary';
import { Product } from '../../../core/services/product/product';
import { CategoryResponse } from '../../../core/models/product/category-response.model';
import { ProductRequest } from '../../../core/models/product/product-request.model';

@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css',
})
export class ProductCreate {
  private fb = inject(FormBuilder);
  private categoryService = inject(Category);
  private cloudinary = inject(Cloudinary);
  private productService = inject(Product);
  private router = inject(Router);

  categories = signal<CategoryResponse[]>([]);
  imageUrls = signal<string[]>([]);
  isUploading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: response => this.categories.set(response.content ?? []),
      error: () => this.errorMessage.set('Unable to load categories.'),
    });
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
    if (this.productForm.invalid || this.isUploading()) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    const request: ProductRequest = {
      ...value,
      imageUrls: this.imageUrls(),
    };

    this.isSubmitting.set(true);
    this.productService.createProduct(request).subscribe({
      next: () => this.router.navigate(['/seller/products']),
      error: () => {
        this.errorMessage.set('Product creation failed. Please review the details and try again.');
        this.isSubmitting.set(false);
      },
    });
  }
}
