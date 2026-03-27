import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css',
})
export class CheckoutSuccess implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(Auth);

  orderId = signal<string | null>(null);
  paymentStatus = signal<'paid' | 'confirmed'>('confirmed');
  showOrdersButton = signal(false);

  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    const status = this.route.snapshot.queryParamMap.get('status');

    this.orderId.set(orderId);
    this.showOrdersButton.set(this.auth.isLoggedIn());

    if (status && status.toLowerCase() === 'paid') {
      this.paymentStatus.set('paid');
    }
  }
}


