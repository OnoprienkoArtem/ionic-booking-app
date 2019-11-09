import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Booking } from './booking.model';
import { AuthService } from '../auth/auth.service';

interface BookingData {
    bookedFrom: string;
    bookedTo: string;
    firstName: string;
    guestNumber: number;
    lastName: string;
    placeId: string;
    placeImage: string;
    placeTitle: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    // tslint:disable-next-line: variable-name
    private _bookings = new BehaviorSubject<Booking[]>([]);

    constructor(private authService: AuthService, private http: HttpClient) {}

    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date
    ) {
        let generatedId: string;
        let newBooking: Booking;
        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => {
                if (!userId) {
                    throw new Error('No user id found!');
                }
                newBooking = new Booking(
                    Math.random().toString(),
                    placeId,
                    userId,
                    placeTitle,
                    placeImage,
                    firstName,
                    lastName,
                    guestNumber,
                    dateFrom,
                    dateTo
                );

                return this.http.post<{ name: string }>(
                    'https://ionic-angular-booking-ap-f1811.firebaseio.com/bookings.json',
                    { ...newBooking, id: null }
                );
            }),
            switchMap(resData => {
                generatedId = resData.name;
                return this.bookings;
            }),
            take(1),
            tap(bookings => {
                newBooking.id = generatedId;
                this._bookings.next(bookings.concat(newBooking));
            })
        );
    }

    cancelBooking(bookingId) {
        return this.http
            .delete(
                `https://ionic-angular-booking-ap-f1811.firebaseio.com/bookings/${bookingId}.json`
            )
            .pipe(
                switchMap(() => {
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    this._bookings.next(
                        bookings.filter(booking => booking.id !== bookingId)
                    );
                })
            );
    }

    fetchBooking() {
        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => {
                if (!userId) {
                    throw new Error('User not found!');
                }
                return this.http.get<{ [key: string]: BookingData }>(
                    `https://ionic-angular-booking-ap-f1811.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${userId}"`
                );
            }),
            map(bookingData => {
                const bookings = [];
                for (const key in bookingData) {
                    if (bookingData.hasOwnProperty(key)) {
                        bookings.push(
                            new Booking(
                                key,
                                bookingData[key].placeId,
                                bookingData[key].userId,
                                bookingData[key].placeTitle,
                                bookingData[key].placeImage,
                                bookingData[key].firstName,
                                bookingData[key].lastName,
                                bookingData[key].guestNumber,
                                new Date(bookingData[key].bookedFrom),
                                new Date(bookingData[key].bookedTo)
                            )
                        );
                    }
                }
                return bookings;
            }),
            tap(bookings => {
                this._bookings.next(bookings);
            })
        );
    }
}
