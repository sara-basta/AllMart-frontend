import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  imports: [RouterLink],
  templateUrl: './payment-failed.html',
  styleUrl: './payment-failed.css',
})
export class PaymentFailed implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  orderId = signal<string | null>(null);
  message = signal('Your payment could not be completed.');

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.orderId.set(params.get('orderId'));
    if (params.get('redirect_status') === 'succeeded') {
      void this.router.navigate(['/payment-success'], {
        queryParams: { orderId: params.get('orderId'), status: 'paid' },
        replaceUrl: true,
      });
    }
  }
}
