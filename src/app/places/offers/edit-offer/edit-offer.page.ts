import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

  form: FormGroup;
  offerPlaces: Place;

  constructor(private route: ActivatedRoute, private navController: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }

      this.offerPlaces = this.placesService.getPlace(paramMap.get('placeId'));

      this.form = new FormGroup({
        title: new FormControl(this.offerPlaces.title, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        description: new FormControl(this.offerPlaces.description, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)]
        })
      });

    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
  }

}
