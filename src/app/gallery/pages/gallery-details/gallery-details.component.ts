import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import Swiper from 'swiper';

import { GalleryService } from '../../services/gallery.service';
import { Image } from '../../interfaces/image.interface';

@Component({
  selector: 'app-gallery-details',
  templateUrl: './gallery-details.component.html',
  styleUrls: ['./gallery-details.component.scss'],
})
export class GalleryDetailsComponent implements OnInit, OnDestroy {
  imageIndex: number;
  imagesArray: Image[];
  paramsSubscription: Subscription;

  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.getImages();
    this.swiperConfig();
  }

  getImages() {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.imagesArray = this.galleryService.getImages(params['name']);
      this.imageIndex = this.galleryService.getImageIndex(
        params['name'],
        +params['id']
      );
    });
  }

  swiperConfig() {
    const swiper = new Swiper('.swiper', {
      slidesPerView: 1,
      autoHeight: true,
      spaceBetween: 50,
      grabCursor: true,
      keyboard: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      on: {
        slideChange: () => {
          const activeIndex = swiper.activeIndex;
          this.updateRouteParams(activeIndex);
        },
      },
    });
    swiper.slideTo(this.imageIndex);
  }

  updateRouteParams(index: number) {
    this.router.navigate([`../${index + 1}`], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  close() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}
