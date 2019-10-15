import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  // tslint:disable-next-line: variable-name
  private _bookings: Booking[] = [
    {
      id: 'xyz',
      placeId: 'p1',
      userId: 'abc',
      placeTitle: 'Manhattan Mansion',
      guestNumber: 2
    }
  ];

  constructor() { }

  get bookings() {
    return [...this._bookings];
  }
}
