import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../../services/user.service';

import {JetUser} from '../../intefaces/interfaces';

import {Observable} from 'rxjs';


@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    user: JetUser = {};
    userFirebase: Observable<firebase.User>;

    constructor(private userService: UserService) {
    }

    ngOnInit() {

        this.userFirebase = this.userService.getUser();
        this.userFirebase.subscribe(userAuth => {
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
        const valid = await this.userService.update(this.user);
        console.log('update', valid);
    }

    logout() {
        this.userService.logout();
    }
}
