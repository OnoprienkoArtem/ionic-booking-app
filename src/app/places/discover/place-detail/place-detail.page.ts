import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { BookingService } from '../../../bookings/booking.service';


@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
    place: Place;
    private placesSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private navController: NavController,
        private placesService: PlacesService,
        private modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        private bookingService: BookingService
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navController.navigateBack('/places/tabs/discover');
                return;
            }

            this.placesSub = this.placesService
                .getPlace(paramMap.get('placeId'))
                .subscribe(place => {
                    this.place = place;
                });
        });
    }

    onBookPlace() {
        // this.router.navigateByUrl('/places/tabs/discover');
        // this.navController.navigateBack('/places/tabs/discover');

        this.actionSheetCtrl
            .create({
                header: 'Choose an Action',
                buttons: [
                    {
                        text: 'Select Date',
                        handler: () => {
                            this.openBookingModal('select');
                        }
                    },
                    {
                        text: 'Random Date',
                        handler: () => {
                            this.openBookingModal('random');
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            })
            .then(actionSheetEl => {
                actionSheetEl.present();
            });
    }

    openBookingModal(mode: 'select' | 'random') {
        console.log(mode);
        this.modalCtrl
            .create({
                component: CreateBookingComponent,
                componentProps: {
                    selectedPlace: this.place,
                    selectedMode: mode
                }
            })
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(resultData => {
                console.log(resultData.data, resultData.role);
                if (resultData.role === 'confirm') {
                    console.log('BOOKED!');
                    this.bookingService.addBooking(this.place.id, this.place.title, this.place.imageUrl, );
                }
            });
    }

    ngOnDestroy() {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }
}
