import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'places', loadChildren: './places/places.module#PlacesPageModule' },
  { path: 'discover', loadChildren: './places/discover/discover.module#DiscoverPageModule' },
  { path: 'offers', loadChildren: './places/offers/offers.module#OffersPageModule' },
  { path: 'new-offer', loadChildren: './places/offers/new-offer/new-offer.module#NewOfferPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
