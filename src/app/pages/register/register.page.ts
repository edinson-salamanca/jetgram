import {Component, OnInit} from '@angular/core';
import {JetUser} from '../../intefaces/interfaces';
import {NgForm} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AlertsService} from '../../services/alerts.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
    registUser: JetUser = {
        email: '',
        name: '',
        password: '',
        avatar: 'av-1.png'
    };

    constructor(
        private userService: UserService,
        private alertService: AlertsService,
    ) {
    }

    ngOnInit() {
    }

    async registerUser(fRegisterUser: NgForm) {
        if (fRegisterUser.invalid) {
            await this.alertService.alertInformative('Debe llenar todos los campos');
            return;
        }

        try {
            await this.userService.singUp(this.registUser);
        } catch (exception) {
            console.log(exception);
        }
    }
}
