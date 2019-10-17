import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loading: HTMLIonLoadingElement;

    constructor(private loadingCtrl: LoadingController) {
    }

    async startLoading(message: string) {
        this.loading = await this.loadingCtrl.create({
            message,
            translucent: true,
            spinner: 'dots',
            cssClass: 'custom-class custom-loading'
        });
        return await this.loading.present();
    }

    async stopLoading() {
        await this.loading.dismiss();
    }
}
