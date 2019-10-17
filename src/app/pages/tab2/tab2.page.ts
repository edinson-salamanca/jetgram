import { Component } from '@angular/core';
import { JetPost } from '../../intefaces/interfaces';
import { UserService } from '../../services/user.service';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { AlertsService } from '../../services/alerts.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  post: JetPost = {};

  constructor(
    private userService: UserService,
    private postService: PostsService,
    private route: Router,
    private alertService: AlertsService
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
}
