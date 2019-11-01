import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
  }

  onLogin() {
    this.authService.login();
    this.loadingCtrl
      .create({keyboardClose: true, message: 'Loggin in ...'})
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1500);
      });

  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(form);
    console.log(email, password);

    if (this.isLogin) {
      // Send a request to login servers
    } else {
      // Send a request to signup servers
      this.authService.signup(email, password);
    }
  }

  onSwitchAuthModel() {
    this.isLogin = !this.isLogin;
  }

}
