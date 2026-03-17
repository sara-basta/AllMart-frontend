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

  uploadedImageUrls = signal<string[]>([]);

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    categoryId: [null as number | null, Validators.required],
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
        });
        if (product.images && product.images.length > 0) {
          const urls = product.images.map(img => img.imageUrl);
          this.uploadedImageUrls.set(urls);
        }
      },
      error: (err) => console.error('Failed to fetch product', err)
    });
  }

  removeImage(index: number) {
    this.uploadedImageUrls.update(urls => urls.filter((_, i) => i !== index));
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.isUploading.set(true);
      
      const uploadRequests = Array.from(files).map(file => this.cloudinary.uploadImage(file));
      
      forkJoin(uploadRequests).subscribe({
        next: (urls: string[]) => {
          this.uploadedImageUrls.update(prev => [...prev, ...urls]);
          this.isUploading.set(false);
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isUploading.set(false);
        }
      });
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const requestData: ProductRequest = {
      ...this.productForm.value as any,
      imageUrls: this.uploadedImageUrls()
    };
    
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
}
