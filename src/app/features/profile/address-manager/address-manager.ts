import { Component, input, output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-address-manager',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './address-manager.html',
  styleUrl: './address-manager.css',
})
export class AddressManager {

  private fb = inject(FormBuilder);

  addresses = input<any[]>([]);
  
  onUpdate = output<{id: number, data: any}>();
  onDelete = output<number>();

  editingAddressId: number | null = null;
  addressForm: FormGroup;

  constructor() {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
  }

  startEdit(address: any) {
    this.editingAddressId = address.id;
    this.addressForm.patchValue({
      street: address.Street || address.street, 
      city: address.city,
      zipCode: address.zipCode
    });
  }

  cancelEdit() {
    this.editingAddressId = null;
    this.addressForm.reset();
  }

  save() {
    if (this.addressForm.invalid || !this.editingAddressId) return;
    this.onUpdate.emit({ id: this.editingAddressId, data: this.addressForm.value });
    this.cancelEdit();
  }

  remove(id: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.onDelete.emit(id);
    }
  }
}
