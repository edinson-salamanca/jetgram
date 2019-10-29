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

    this.ref = this.storage.ref('posts/images').child(`${id}`);
    this.task = this.ref.put(img);

    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));

    this.uploadProgress = this.task.percentageChanges();

    this.downloadURL = this.task
      .snapshotChanges()
      .pipe(map(snaphot => snaphot.ref.getDownloadURL()));
  }

  getUploadProgress() {
    return this.uploadProgress;
  }

  getUploadSta() {
    return this.uploadState.subscribe(state => state);
  }

  getDownloadURL() {
    return this.downloadURL.pipe(map(url => url));
  }
}
