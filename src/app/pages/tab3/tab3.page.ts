import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../../services/user.service';

import {JetUser} from '../../intefaces/interfaces';
import {LoadingService} from '../../services/loading.service';
import {Observable} from 'rxjs';
import {User} from 'firebase';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    user: JetUser = {};
    userFirabe: Observable<firebase.User>;

    constructor(private userService: UserService) {
    }

    ngOnInit() {

        this.userFirabe = this.userService.getUser();
        this.userFirabe.subscribe(userAuth => {
            if (userAuth) {
                this.user.id = userAuth.uid;
                this.user.email = userAuth.email;
                this.user.name = userAuth.displayName;
                this.user.avatar = userAuth.photoURL;
            }
        });
    }

    async actualizar(fActualizar: NgForm) {
        if (fActualizar.invalid) {
            return;
        }
        const valid = await this.userService.updateUser(this.user);
        console.log('update', valid);
    }

    async logout() {
        await this.userService.logout();
    }
}
