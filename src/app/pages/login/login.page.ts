import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IonSlides, LoadingController, NavController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {AlertsService} from '../../services/alerts.service';
import {JetUser} from '../../intefaces/interfaces';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    @ViewChild('slidePrincipal', {static: true}) slides: IonSlides;
    avatarSlide = {
        slidesPerView: 3.5
    };

    loginUser = {
        email: '',
        password: ''
    };
    registerUser: JetUser = {
        email: '',
        name: '',
        password: '',
        avatar: 'av-1.png'
    };

    constructor(private userService: UserService,
                private alertsService: AlertsService,
                private navCtrl: NavController,
                private loadingController: LoadingController) {
        console.log('construcLogin');
    }

    async ngOnInit() {
        await this.slides.lockSwipes(true);
        console.log('init');
    }

    async login(fLogin: NgForm) {
        if (fLogin.invalid) {
            await this.alertsService.alertInformativa('Hay campos vacíos');
            return;
        }
        const valid = await this.userService.login(this.loginUser.email, this.loginUser.password);
        if (valid) {
            this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
            this.alertsService.toastAlert('Bienvenido');
        } else {
            await this.alertsService.alertInformativa('Usuario/contraseña no validas');
        }
    }

    async registro(fRegistro: NgForm) {
        if (fRegistro.invalid) {
            await this.alertsService.alertInformativa('Debes llenar todos los campos');
            return;
        }
        try {
            await this.userService.singnup(this.registerUser);
            this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
            this.alertsService.toastAlert('Bienvenido');
        } catch (e) {
            await this.alertsService.alertInformativa(e.message);
        }
    }


    async mostrarRegistro() {
        await this.slides.lockSwipes(false);
        await this.slides.slideTo(0);
        await this.slides.lockSwipes(true);
    }

    async mostrarLogin() {
        await this.slides.lockSwipes(false);
        await this.slides.slideTo(1);
        await this.slides.lockSwipes(true);
    }
}
