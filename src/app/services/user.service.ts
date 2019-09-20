import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {JetUser} from '../intefaces/interfaces';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    user: Observable<firebase.User>;

    constructor(private firebaseAuth: AngularFireAuth,
                private navCtrl: NavController) {

        this.user = this.firebaseAuth.authState;
        console.log('constructor: ', this.user);
    }

    login(email: string, password: string) {
        return new Promise((resolve) => {
            this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });
    }

    singnup(user: JetUser) {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
                .then(resp => {
                    resp.user.updateProfile({
                        displayName: user.avatar,
                        photoURL: user.avatar
                    });
                    resolve(true);
                })
                .catch(err => reject(err));
        });
    }

    async userValid(): Promise<boolean> {
        await this.user.subscribe(user => {
            if (!user) {
                this.navCtrl.navigateRoot('/login');
                return Promise.resolve(true);
            }
        });
        return Promise.resolve(true);
    }
}
