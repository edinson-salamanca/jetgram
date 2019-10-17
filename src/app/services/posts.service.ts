import { Injectable, EventEmitter } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { JetPost } from '../intefaces/interfaces';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private allColletion: AngularFirestoreCollection<JetPost>;
  private ColletionPostsStartAfter: AngularFirestoreCollection<JetPost>;

  private posts: Observable<JetPost[]>;

  newPost = new EventEmitter<JetPost>();

  constructor(private db: AngularFirestore) {
    this.getPosts();
    /* this.allColletion = db.collection<JetPost>('posts', ref =>
                ref.orderBy('created_at', 'desc').limit(10));
             this.posts = this.allColletion.snapshotChanges()
                  .pipe(
                      map(actions => {
                          return actions.map(a => {
                              const data = a.payload.doc.data();
                              const id = a.payload.doc.id;
                              return {id, ...data};
                              // return { ...data };
                          });
                      })
                  ); */
  }

  getPosts() {
    this.allColletion = this.db.collection<JetPost>('posts', ref =>
      ref.orderBy('created_at', 'desc').limit(10)
    );

    return this.allColletion.snapshotChanges().pipe(
      map(post => {
        return post.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getPostNext(...data: Array<JetPost>) {
    const createAt = data.pop().created_at;

    this.ColletionPostsStartAfter = this.db.collection<JetPost>('posts', ref =>
      ref
        .orderBy('created_at', 'desc')
        .startAfter(createAt)
        .limit(10)
    );

    return this.ColletionPostsStartAfter.snapshotChanges().pipe(
      map(actions => {
        console.log('getPostActivate');
        return actions.map(a => {
          const data1 = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data1 };
          // return { ...data1 };
        });
      })
    );
  }

  /*crear nuevo post*/
  createPost(post) {
    return new Promise(resolve => {
      this.db
        .collection('posts')
        .add(post)
        .then(resp => {
          this.newPost.emit(post);
          resolve(true);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  uploadImage(file) {}
}
