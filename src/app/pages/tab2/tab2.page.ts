import {Component} from '@angular/core';
import {JetPost} from '../../intefaces/interfaces';
import {UserService} from '../../services/user.service';
import {PostsService} from '../../services/posts.service';
import {Router} from '@angular/router';
import {AlertsService} from '../../services/alerts.service';
import * as moment from 'moment';

import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';


@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    post: JetPost = {};
    tempImages: string[] = [];

    constructor(
        private userService: UserService,
        private postService: PostsService,
        private route: Router,
        private alertService: AlertsService,
        private camera: Camera,
        private webView: WebView
    ) {
    }

    createPost() {
        this.post.created_at = moment().format('MMDDYYYYHHmmss');
        this.post.imgs = ['av-3.png'];
        this.post.coords = '';

        this.userService.getUser().subscribe(user => {
            this.post.user = {
                id: user.uid,
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL
            };
            const validCreatePost = this.postService.createPost(this.post);

            if (validCreatePost) {
                this.route.navigateByUrl('/main/tabs/tab1');
                this.alertService.toastAlert('Post subido correctamente');
            }
            this.post = {
                imgs: null,
                message: '',
                user: null,
                created_at: '',
                coords: ''
            };
        });
    }

    takePhoto() {
        const options: CameraOptions = {
            quality: 60,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.CAMERA
        };
        this.processImage(options);
    }

    libreria() {
        const options: CameraOptions = {
            quality: 60,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.processImage(options);
    }

    processImage(options: CameraOptions) {
        this.camera.getPicture(options).then((imageData) => {

            const img = this.webView.convertFileSrc(imageData);

            this.tempImages.push(img);
        }, (err) => {
            console.log(err);
        });
    }

}
