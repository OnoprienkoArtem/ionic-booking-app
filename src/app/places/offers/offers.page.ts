import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.page.html',
    styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
    offerPlaces: Place[];
    isLoading = false;
    private placesSub: Subscription;

    constructor(private placesService: PlacesService, private router: Router) {}

    ngOnInit() {
        this.placesSub = this.placesService.places.subscribe(places => {
            this.offerPlaces = places;
        });
    }

    ionViewWillEnter() {
        this.isLoading = true;
        this.placesService.fetchPlaces().subscribe(() => {
            this.isLoading = false;
        });
    }

    onEdit(id: string, slidingItem: IonItemSliding) {
        slidingItem.close();
        this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', id]);
        console.log('edit place', id);
    }

    ngOnDestroy() {
      if (this.placesSub) {
        this.placesSub.unsubscribe();
      }
    }
}
