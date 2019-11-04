import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor(
    private alertController: AlertController,
    private toastCtrl: ToastController
  ) {}

  async alertInformative(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['ok']
    });
    await alert.present();
  }

  async toastAlert(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1000
    });
    await toast.present();
  }
}
