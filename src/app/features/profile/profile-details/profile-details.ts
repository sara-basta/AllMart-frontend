import { Component, input, output, inject, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserResponse } from '../../../core/models/user/user-response.model';

@Component({
  selector: 'app-profile-details',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-details.html',
  styleUrl: './profile-details.css',
})
export class ProfileDetails implements OnInit{

  private fb = inject(FormBuilder);

  currentUser = input.required<any>();
  isSaving = input<boolean>(false);
  
  onSave = output<any>();

  isEditing = false;
  profileForm!: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });

    effect(() => {
      const user = this.currentUser();
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName
        });
      }
    });
  }

  ngOnInit() {}

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
       this.profileForm.patchValue({
         firstName: this.currentUser().firstName,
         lastName: this.currentUser().lastName
       });
    }
  }

  submit() {
    if (this.profileForm.valid) {
      this.onSave.emit(this.profileForm.value);
      this.isEditing = false;
    }
  }
}
