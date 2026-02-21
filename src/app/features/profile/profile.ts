import { Component, inject } from '@angular/core';
import { User } from '../../core/services/user/user';


@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  public user = inject(User);
}
