import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IonSlides, LoadingController, NavController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {AlertsService} from '../../services/alerts.service';
import {JetUser} from '../../intefaces/interfaces';
import {LoadingService} from '../../services/loading.service';
import {log} from 'util';

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
                private loadingService: LoadingService) {
    }

    async ngOnInit() {
        await this.slides.lockSwipes(true);
    }

    async login(fLogin: NgForm) {
        if (fLogin.invalid) {
            await this.alertsService.alertInformativa('Hay campos vacíos');
            return;
        }
        await this.loadingService.startLoading('Espere por favor');

        const valid = await this.userService.login(this.loginUser.email, this.loginUser.password);


        if (valid) {
            await this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
            await this.alertsService.toastAlert('Bienvenido');
        } else {
            await this.alertsService.alertInformativa('Usuario/contraseña no validas');
        }
        await this.loadingService.stopLoading();
    }

    async registro(fRegistro: NgForm) {
        if (fRegistro.invalid) {
            await this.alertsService.alertInformativa('Debes llenar todos los campos');
            return;
        }
        await this.loadingService.startLoading('Espere por favor');
        try {
            await this.userService.singUp(this.registerUser);
            await this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
            await this.alertsService.toastAlert('Bienvenido');
        } catch (e) {
            await this.alertsService.alertInformativa(e.message);
        }
        await this.loadingService.stopLoading();
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
