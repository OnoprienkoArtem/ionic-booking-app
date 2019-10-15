import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';



@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  offerPlaces: Place[];

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.offerPlaces = this.placesService.places;
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', id]);
    console.log('edit place', id);
  }

}
