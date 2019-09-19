import {Component} from '@angular/core';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    posts = {
        user: {
            name: 'Ruben Elias',
            email: 'ruben@gmail.com',
            avatar: {
                url: '/assets/avatars/av-1.png'
            }
        },
        photo: {
            url: '/assets/perro-2.jpg'
        }
    };

    constructor() {
    }

}
