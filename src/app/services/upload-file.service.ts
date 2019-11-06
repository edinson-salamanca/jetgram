import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private ref: AngularFireStorageReference;
  private task: AngularFireUploadTask;

  constructor(private storage: AngularFireStorage) {}

  uploadImage(img: Blob): Observable<UploadTaskSnapshot> {
    const id = new Date().getTime();

    this.ref = this.storage.ref('/posts/').child(`imagenes/${id}.jpeg`);
    this.task = this.ref.put(img);

    return this.task.snapshotChanges();
  }
}
