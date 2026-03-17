import { ProductResponse } from './../../core/models/product/product-response.model';
import {Component, inject, OnInit, signal} from '@angular/core';
import { Product } from '../../core/services/product/product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Cart } from '../../core/services/cart/cart';
import { FormsModule } from '@angular/forms';
import { Review } from '../../core/services/review/review';
import { ReviewResponse } from '../../core/models/review/review-response.model';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit{

  private product = inject(Product);
  private route = inject(ActivatedRoute);
  private cart = inject(Cart);
  private review = inject(Review);
  private auth = inject(Auth);

  productId!: number;
  productRes = signal<ProductResponse | null>(null);
  
  currentMainImage = signal<string | null>(null);

  newReview = { rating: 0, comment: '' };
  reviewError = '';
  isSubmittingReview = false;

  reviews = signal<ReviewResponse[]>([]);
  isLoadingReviews = signal(true);
  canUserReview = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const idString = param.get('id');

      // get the product
      if(idString){
        this.productId = Number(idString);
        this.product.getProductById(this.productId).subscribe({
          next: (data) => {
            this.productRes.set(data);
            if (data.images && data.images.length > 0) {
              this.currentMainImage.set(data.images[0].imageUrl);
            }
          },
          error: (err) => {
            console.error('Failed to load product details', err);
          }
        });
      }

      // load the reviews
      this.loadReviews(this.productId);

      // check if user had the right to review
      if (this.auth.getToken()) {
        this.review.checkEligibility(this.productId).subscribe({
          next: (isEligible) => {
            console.log("Backend says canReview is:", isEligible);
            this.canUserReview.set(isEligible);
          },
          error: (err) => {
            console.error("Eligibility request threw an error:", err);
            this.canUserReview.set(false);
          }
        });
      } else {
        console.log("No auth token found, user is not logged in.");
        this.canUserReview.set(false);
      }
    });
  }

  addToCart() {
    const currentProduct = this.productRes();
    if (currentProduct) {
      this.cart.addToCart(currentProduct); 
    }
  }

  loadReviews(id: number) {
    this.isLoadingReviews.set(true);
    this.review.getProductReviews(id, 0, 10).subscribe({
      next: (response: { content: ReviewResponse[] }) => {
        this.reviews.set(response.content || []);
        this.isLoadingReviews.set(false);
      },
      error: (err) => {
        console.error('Failed to load reviews', err);
        this.reviews.set([]);
        this.isLoadingReviews.set(false);
      }
    });
  }

  setRating(stars: number) {
    this.newReview.rating = stars;
  }

  submitReview() {
    if (this.newReview.rating === 0) {
      this.reviewError = "Please select a rating.";
      return;
    }
    if (!this.newReview.comment.trim()) {
      this.reviewError = "Please write a comment.";
      return;
    }

    this.isSubmittingReview = true;
    this.reviewError = '';

    this.review.addReview(this.productId, this.newReview).subscribe({
      next: (response) => {
        this.isSubmittingReview = false;
        this.newReview = { rating: 0, comment: '' };
        
        this.reviews.set([response, ...(this.reviews() || [])]); 
        
        // re-check eligibility to lock the form instantly if the user hit their limit
        if (this.auth.getToken()) {
          this.review.checkEligibility(this.productId).subscribe({
             next: (isEligible) => this.canUserReview.set(isEligible)
          });
        }
      },
      error: (err) => {
        this.isSubmittingReview = false;
        this.reviewError = err.error?.message || "You cannot review this product.";
      }
    });
  }

  selectImage(url: string) {
    this.currentMainImage.set(url);
  }
}
