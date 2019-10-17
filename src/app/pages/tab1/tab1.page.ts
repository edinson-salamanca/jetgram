import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { JetPost } from '../../intefaces/interfaces';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
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
  data: Array<JetPost> = [];
  spinner = true; // true spinner activo false desactivo

  enabled: boolean; // infinite scroll

  private nexPost: Subscription;

  constructor(private postService: PostsService) {
    this.spinner = true;

    this.enabled = true;
  }

  ngOnInit() {
    console.log('init');

    this.getPosts();
    /*escucha emit de newPost*/
    this.postService.newPost.subscribe(post => {
      // this.data.unshift(post);
    });

    /*data.subscribe(user => {
            user.map(snap => {
                this.data.unshift(snap.payload.doc.data());
            });
        });*/
  }

  nextPost(event?, pull: boolean = false) {
    /* this.postService.getPostNext(this.data); */
    this.postService.getPostNext(...this.data).pipe(
      map(posts => {
        console.log('resp', posts);
      })
    );

    this.nexPost = this.postService
      .getPostNext(...this.data)
      .subscribe(posts => {
        console.log('POSTNEXT:', posts);

        if (event) {
          this.data.push(...posts);
          event.target.complete();

          if (posts.length === 0) {
            this.enabled = false;
          }
        } else {
          this.data = [];
        }
        this.nexPost.unsubscribe();
      });
  }
  getPosts(event?) {
    this.postService.getPosts().subscribe(posts => {
      this.data = [];
      console.log('getPost', this.data);
      this.data = posts;

      this.enabled = true;
    });
  }
  recargar(event) {
    console.log(event);
  }
}
