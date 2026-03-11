import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/services/category/category';
import { CategoryResponse } from '../../../core/models/product/category-response.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit{

  private category = inject(Category);

  categories = signal<CategoryResponse[]>([]);
  isLoading = signal(true);
  
  newCategoryName = '';
  editingId = signal<number | null>(null);
  editName = '';

  newCategory = {
    name: '',
    description: ''
  };

  editForm = {
    name: '',
    description: ''
  };

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading.set(true);
    this.category.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.content || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.isLoading.set(false);
      }
    });
  }

  createCategory() {
    if (!this.newCategory.name.trim() || !this.newCategory.description.trim()) return;
    
    this.category.createCategory(this.newCategory).subscribe({
      next: () => {
        this.newCategory = { name: '', description: '' };
        this.loadCategories();
      }
    });
  }

  startEdit(category: CategoryResponse) {
    this.editingId.set(category.id);
    this.editForm = { name: category.name, description: category.description };
  }

  saveEdit(id: number) {
    this.category.updateCategory(id, this.editForm).subscribe({
      next: () => {
        this.editingId.set(null);
        this.loadCategories();
      }
    });
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  deleteCategory(id: number) {
    if (confirm('Do you really want to delete this category?')) {
      this.category.deleteCategory(id).subscribe({
        next: () => this.loadCategories()
      });
    }
  }

}
