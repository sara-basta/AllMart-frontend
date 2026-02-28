import { Component, signal } from '@angular/core'; // <--- You were missing 'signal' here
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  slides = [
    {
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop',
      badge: 'Welcome to AllMart',
      title: 'Everything you need.',
      subtitle: 'From daily groceries to the latest electronics. Millions of items, right here.',
      ctaText: 'Shop All Departments',
      ctaLink: '/catalog'
    },
    {
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2000&auto=format&fit=crop',
      badge: 'Tech Week Sale',
      title: 'Up to 40% Off Tech',
      subtitle: 'Upgrade your workstation with our latest arrivals in electronics and accessories.',
      ctaText: 'Shop Electronics',
      ctaLink: '/catalog?categoryId=2'
    },
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop',
      badge: 'New Collection',
      title: 'Spring Fashion 2026',
      subtitle: 'Discover the latest trends in clothing and accessories for the new season.',
      ctaText: 'Explore Fashion',
      ctaLink: '/catalog?categoryId=3'
    }
  ];

  currentSlide = signal(0);

  nextSlide() {
    this.currentSlide.update((i: number) => (i + 1) % this.slides.length);
  }

  prevSlide() {
    this.currentSlide.update((i: number) => (i === 0 ? this.slides.length - 1 : i - 1));
  }

  setSlide(index: number) {
    this.currentSlide.set(index);
  }
}
