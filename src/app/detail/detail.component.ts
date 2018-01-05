import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GithubService } from '../service/github.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  private error: string[] = [];
  private repo: any;
  private stargazers: any[];

  constructor(private service: GithubService, private router: Router) { }
  
  ngOnInit() {
    this.repo = this.service.currentRepo;

    this.service.getStargazers().subscribe(
      (response: any) => this.stargazers = response,
      (error: string) => {
        if (error.indexOf("Not logged in") > -1) this.router.navigate(['/']);
        else this.backHome();
      }
    );
  }

  backHome() {
    //console.log('DetailCompnent.backHome()');
    this.router.navigate(['/home']);
  }

}
