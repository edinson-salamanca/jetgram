import {Component} from '@angular/core';
import {JetPost, JetTempImg} from '../../intefaces/interfaces';
import {UserService} from '../../services/user.service';

import {PostsService} from '../../services/posts.service';
import {UploadFileService} from '../../services/upload-file.service';

import {Router} from '@angular/router';
import {AlertsService} from '../../services/alerts.service';
import {File} from '@ionic-native/file/ngx';

import * as moment from 'moment';

import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Platform} from '@ionic/angular';


@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    post: JetPost = {};

    tempImages: Array<JetTempImg> = [];
    data: string[] = [];

    private images: Blob[] = [];

    constructor(
        private userService: UserService,
        private postService: PostsService,
        private uploadFileService: UploadFileService,
        private route: Router,
        private alertService: AlertsService,
        private camera: Camera,
        private webView: WebView,
        private platform: Platform,
        private file: File
    ) {
    }

    createPost() {
        this.post.created_at = moment().format('MMDDYYYYHHmmss');

        this.post.coords = '';

        this.userService.getUser();
        console.log('crear', this.post);

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

    uploadImage() {
        const promises: Array<Promise<any>> = [];

        this.images.forEach((img, index) => {
            promises.push(this.buildPromise(img, index));
        });

        this.runPromises(promises);
    }

    /**
     * ejecuta un areglo de promesas
     * @param promises arreglo de promesas
     */
    private runPromises(promises: Array<Promise<any>>) {
        Promise.all(promises)
            .then(resp => {
                const imgs: Array<string> = [];
                resp.forEach(url => {
                    imgs.push(url);
                });


                this.post.imgs = imgs;
                this.images = [];
                this.tempImages = [];
                this.createPost();

            })
            .catch(err => {
                console.log('errorPromises all:', err);
            });
    }

    /**
     * construye una promesa
     * @param img imagen a subir
     * @param index posición actual de la imagen
     * @returns una nueva promesa
     */
    private buildPromise(img: Blob, index: number): Promise<any> {
        return new Promise(resolve => {

            const upload = this.uploadFileService.uploadImage(img);

            upload.subscribe(resp => {
                const progress = (resp.bytesTransferred / resp.totalBytes) * 100;

                this.tempImages[index].progress = progress;

                if (progress === 100) {
                    this.tempImages[index].upload = true;
                    resolve(resp.ref.getDownloadURL());
                }
            }, error => {
                console.log('error en en promesa: ', error);
            });
        });
    }

    async takePhoto() {
        const options: CameraOptions = {
            quality: 60,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.CAMERA
        };
        await this.processImage(options, true);
    }

    async library() {
        const options: CameraOptions = {
            quality: 60,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        await this.processImage(options);
    }

    async processImage(options: CameraOptions, camera = false) {
        const imageData: string = await this.camera.getPicture(options);

        this.addTempImage(imageData);

        let file: string;

        if (this.platform.is('ios')) {
            file = imageData.split('/').pop();
        } else {
            if (camera) {
                file = imageData.substring(imageData.lastIndexOf('/') + 1);
            } else {
                file = imageData.substring(
                    imageData.lastIndexOf('/') + 1,
                    imageData.indexOf('?')
                );
            }
        }

        const path = imageData.substring(0, imageData.lastIndexOf('/'));

        const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);

        /*const blob: Blob[] = [];
            blob.push(new Blob([buffer], {type: 'image/jpeg'}));*/
        /* this.postService.uploadImage(blob);*/
        this.images.push(new Blob([buffer], {type: 'image/jpeg'}));
    }

    addTempImage(image: string) {
        const img = this.webView.convertFileSrc(image);

        const jetTempImg: JetTempImg = {
            img,
            progress: 0,
            upload: false
        };
        this.tempImages.unshift(jetTempImg);
    }
}
