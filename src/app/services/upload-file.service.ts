import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private uploadState: Observable<string>;
  private uploadProgress: Observable<number>;
  private downloadURL: Observable<Promise<string>>;

  private ref: AngularFireStorageReference;
  private task: AngularFireUploadTask;

  constructor(private storage: AngularFireStorage) {}

  uploadImage(img: Blob) {
    const id = new Date().getTime();

    this.ref = this.storage.ref('posts/images').child(`${id}.jpeg`);
    this.task = this.ref.put(img);

    this.uploadProgress = this.task.percentageChanges();
  }

  getUploadProgress() {
    return this.uploadProgress;
  }

  getUploadState() {
    return this.task.task.on('state_changed', snapshot => {
      console.log('state: ', snapshot.state);
    });
  }

  async getDownloadURL() {
    return await this.task.task.snapshot.ref.getDownloadURL();
  }
}
