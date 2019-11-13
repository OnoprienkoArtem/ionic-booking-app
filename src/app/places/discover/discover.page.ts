import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SegmentChangeEventDetail } from '@ionic/core';
import { take, map, tap, delay } from 'rxjs/operators';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
    loadedPlaces: Place[];
    listedLoadedPlaces: Place[];
    relevantPlaces: Place[];
    isLoading = false;
    private placesSub: Subscription;

    constructor(
        private placesService: PlacesService,
        private menuCtrl: MenuController,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.placesSub = this.placesService.places.subscribe(places => {
            console.log(places);
            this.loadedPlaces = places;
            this.relevantPlaces = this.loadedPlaces;
            this.listedLoadedPlaces = this.relevantPlaces.slice(1);
        });
    }

    ionViewWillEnter() {
        this.isLoading = true;
        this.placesService.fetchPlaces().subscribe(() => {
            this.isLoading = false;
        });
    }

    onOpenMenu() {
        this.menuCtrl.toggle();
    }

    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
        this.authService.userId.pipe(take(1)).subscribe(userId => {
            if (event.detail.value === 'all') {
                this.relevantPlaces = this.loadedPlaces;
                this.listedLoadedPlaces = this.relevantPlaces.slice(1);
                console.log('all - relevantPlaces', this.relevantPlaces);
                console.log('all - listedLoadedPlaces', this.listedLoadedPlaces);
            } else {
                this.relevantPlaces = this.loadedPlaces.filter(
                    place => place.userId !== userId
                );
                this.listedLoadedPlaces = this.relevantPlaces.slice(1);
                console.log('bookable - relevantPlaces', this.relevantPlaces);
                console.log('bookable - listedLoadedPlaces', this.listedLoadedPlaces);
            }
        });
    }

    ngOnDestroy() {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }
}
