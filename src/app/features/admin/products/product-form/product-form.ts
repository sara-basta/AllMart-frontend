import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../core/services/product/product';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Category } from '../../../../core/services/category/category';
import { CategoryResponse } from '../../../../core/models/product/category-response.model';
import { ProductRequest } from '../../../../core/models/product/product-request.model';
import { ProductResponse } from '../../../../core/models/product/product-response.model';
import { Cloudinary } from '../../../../core/services/cloudinary/cloudinary';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  private fb = inject(FormBuilder);
  private product = inject(Product);
  private category = inject(Category);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  productId = signal<number | null>(null);
  categories = signal<CategoryResponse[]>([]);
  isSubmitting = signal(false);

  private cloudinary = inject(Cloudinary);
  isUploading = signal(false);
  previewUrl = signal<string | null>(null);

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    categoryId: [null as number | null, Validators.required],
    imageUrl: ['']
  });

  ngOnInit() {
    this.category.getAllCategories().subscribe({
      next: (res) => {
        const fetchedCategories = res.content || [];
        this.categories.set(fetchedCategories);

        // ONLY after categories are loaded, check if we need to edit a product
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
          this.isEditMode.set(true);
          this.productId.set(Number(idParam));
          this.loadProductData(this.productId()!, fetchedCategories);
        }
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadProductData(id: number, loadedCategories: CategoryResponse[]) {
    this.product.getAdminProductById(id).subscribe({
      next: (product: ProductResponse) => {
        const matchedCategory = loadedCategories.find(c => c.name === product.categoryName);
        const categoryIdToSelect = matchedCategory ? matchedCategory.id : null;

        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stockQuantity: product.stockQuantity || 0,
          categoryId: categoryIdToSelect, 
          imageUrl: product.imageUrl
        });

        if (product.imageUrl) {
          this.previewUrl.set(product.imageUrl);
        }
      },
      error: (err) => console.error('Failed to fetch product', err)
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    const requestData = this.productForm.value as ProductRequest;

    if (this.isEditMode() && this.productId()) {
      
      this.product.updateProduct(this.productId()!, requestData).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => { 
          console.error('Update failed', err); 
          this.isSubmitting.set(false); 
        }
      });
      
    } else {
      this.product.createProduct(requestData).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => { 
          console.error('Failed to create product', err); 
          this.isSubmitting.set(false); 
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading.set(true);
      
      this.cloudinary.uploadImage(file).subscribe({
        next: (url: string) => {
          this.productForm.patchValue({ imageUrl: url });
          this.previewUrl.set(url);
          this.isUploading.set(false);
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isUploading.set(false);
        }
      });
    }
  }
}
