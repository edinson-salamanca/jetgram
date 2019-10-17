import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { JetUser } from '../intefaces/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: Observable<firebase.User>;
  private valid = true;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private navCtrl: NavController,
    private firebaseStorage: AngularFireStorage
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

  async singUp(user: JetUser) {
    this.firebaseAuth.auth.useDeviceLanguage();

    return await new Promise((resolve, reject) => {
      this.firebaseAuth.auth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(resp => {
          resp.user.updateProfile({
            displayName: user.name,
            photoURL: user.avatar
          });
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }

  getUser() {
    if (this.userValid()) {
      /* this.user.subscribe(userAuth => {
                 user.id = userAuth.uid;
                 user.email = userAuth.email;
                 user.name = userAuth.displayName;
                 user.avatar = userAuth.photoURL;
             });*/
      return this.user;
    }
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

  /* actualizar usuarios */
  updateUser(user: JetUser) {
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

  async logout() {
    await this.firebaseAuth.auth.signOut();
    await this.navCtrl.navigateRoot('/login', { animated: true });
  }
}
