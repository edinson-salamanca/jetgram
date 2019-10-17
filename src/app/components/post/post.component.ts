import { Component, Input, OnInit } from '@angular/core';
import { JetPost } from '../../intefaces/interfaces';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
    @Input() post: JetPost = {};
    @Input() indexDebug;

    slideSoloOpts = {
        allowSlideNext: false,
        allowSlidePrev: false,
    };

    constructor() {
    }

    ngOnInit() {
    }

}
