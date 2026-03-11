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
    this.product.getProductById(id).subscribe({
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

        // LOCK DOWN THE NON-EDITABLE FIELDS
        if (this.isEditMode()) {
          this.productForm.get('name')?.disable();
          this.productForm.get('description')?.disable();
          this.productForm.get('imageUrl')?.disable();
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
    
    // .getRawValue() is used because some fields are disabled during edit
    const formData = this.productForm.getRawValue(); 

    if (this.isEditMode() && this.productId()) {
      const id = this.productId()!;
      
      forkJoin([
        this.product.updateProductPrice(id, formData.price!),
        this.product.updateProductStock(id, formData.stockQuantity!),
        this.product.updateProductCategory(id, formData.categoryId!)
      ]).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => { 
          console.error('Failed to update product details', err); 
          this.isSubmitting.set(false); 
        }
      });
      
    } else {
      // Cast the raw value to ProductRequest to satisfy the service type
      const requestData = formData as ProductRequest;

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
          console.log('Image uploaded to backend successfully:', url);
        },
        error: (err) => {
          console.error('Backend upload failed', err);
          this.isUploading.set(false);
        }
      });
    }
  }
}
