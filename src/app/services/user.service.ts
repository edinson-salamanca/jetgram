import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavController} from '@ionic/angular';
import {JetUser} from '../intefaces/interfaces';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    user: Observable<firebase.User>;

    constructor(
        private firebaseAuth: AngularFireAuth,
        private navCtrl: NavController,
        private db: AngularFirestore
    ) {
        this.user = this.firebaseAuth.authState;
    }

    login(email: string, password: string) {
        return new Promise(resolve => {
            this.firebaseAuth.auth
                .signInWithEmailAndPassword(email, password)
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });
    }

    singUp(jetUser: JetUser) {
        this.firebaseAuth.auth.useDeviceLanguage();

        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth
                .createUserWithEmailAndPassword(jetUser.email, jetUser.password)
                .then(resp => {
                    const userFirebase: firebase.User = resp.user;

                    userFirebase.updateProfile({
                        displayName: jetUser.name,
                        photoURL: jetUser.avatar,
                    });


                    jetUser.id = userFirebase.uid;
                    jetUser.password = '';

                    this.createUser(jetUser);

                    resolve(true);

                })
                .catch(err => reject(err));
        });
    }

    async createUser(jetUser: JetUser) {

        await this.db.collection('users').add(jetUser);
    }

    getUser() {
        if (this.userValid()) {
            const userData = this.user.toPromise().then(resp => {
                console.log(resp.displayName);
            });

            /* this.user.subscribe(userAuth => {
                                   user.id = userAuth.uid;
                                   user.email = userAuth.email;
                                   user.name = userAuth.displayName;
                                   user.avatar = userAuth.photoURL;
                               });*/

            return this.user;
        }
    }

    userValid(): Promise<boolean> {
        return new Promise(resolve => {
            this.user.subscribe(
                user => {
                    if (user) {
                        return resolve(true);
                    } else {
                        this.navCtrl.navigateRoot('/login', {animated: true}).then();
                        return resolve(false);
                    }
                },
                err => {
                    console.log('error en userValid', err);
                }
            );
        });
    }

    /* actualizar usuarios */

    update(user: JetUser) {
        return new Promise(resolve => {
            this.firebaseAuth.auth.currentUser
                .updateEmail(user.email)
                .then(() => {
                    this.firebaseAuth.auth.currentUser
                        .updateProfile({
                            displayName: user.name,
                            photoURL: user.avatar
                        })
                        .then(() => {
                            resolve(true);
                        })
                        .catch(err => {
                            resolve(true);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    logout() {
        this.firebaseAuth.auth.signOut().then(() => {
            this.navCtrl
                .navigateRoot('/login', {
                    animated: true,
                    animationDirection: 'forward'
                })
                .then();
        });
    }
}
