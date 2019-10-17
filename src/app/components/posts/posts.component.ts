import {Component, Input, OnInit} from '@angular/core';
import {JetPost} from '../../intefaces/interfaces';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
    @Input() posts: JetPost[] = [];

    constructor() {
    }

    ngOnInit() {
      console.log(this.posts);
    }

}
