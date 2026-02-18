import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-go-back-button',
  imports: [],
  templateUrl: './go-back-button.html',
  styleUrl: './go-back-button.css',
})
export class GoBackButton {
  private location = inject(Location);

  goBack(): void {
    this.location.back();
  }

}
