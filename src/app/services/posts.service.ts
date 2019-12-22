import {Injectable, EventEmitter} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';

import {JetPost} from '../intefaces/interfaces';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private allCollection: AngularFirestoreCollection<JetPost>;
    private collectionPostsStartAfter: AngularFirestoreCollection<JetPost>;

    /*private posts: Observable<JetPost[]>;

    newPost = new EventEmitter<JetPost>();*/

    constructor(private db: AngularFirestore) {
        this.getPosts();

    }

    getPosts() {
        this.allCollection = this.db.collection<JetPost>('posts', ref =>
            ref.orderBy('created_at', 'desc')
                .limit(10)
        );

        return this.allCollection.snapshotChanges().pipe(
            map(post => {
                return post.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;

                    return {id, ...data};
                });
            })
        );
    }

    getPostsNext(...data: Array<JetPost>) {
        const createAt = data.pop().created_at;

        this.collectionPostsStartAfter = this.db.collection<JetPost>('posts', ref =>
            ref.orderBy('created_at', 'desc')
                .startAfter(createAt)
                .limit(10)
        );

        return this.collectionPostsStartAfter.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data1 = a.payload.doc.data();
                    const id = a.payload.doc.id;

                    return {id, ...data1};
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
                    /*this.newPost.emit(post);*/
                    resolve(true);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }
}
