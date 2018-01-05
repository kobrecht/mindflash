import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GithubService } from '../service/github.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private error: string[] = [];
  private user: any;
  private org: string;
  private organization: any;
  private orgs: string[];
  private members: {
    page: number,
    view: any[]
  };
  private repos: {
    page: number,
    view: any[]
  };

  constructor(private service: GithubService, private router: Router) { }

  ngOnInit() {
    this.service.getUser().subscribe(
      (response: any) => this.user = response,
      (error: string) => {
        this.error.push(error);
        if (error.indexOf("Not logged in") > -1) this.router.navigate(['/']);
      }
    );

    this.service.getOrgs().subscribe(
      (response: string[]) => {
        this.orgs = response;
        if (this.orgs.length === 1) this.org = this.orgs[0]['login'];
        this.reload();
      },
      (error: string) => {
        this.error.push(error);
      }
    );
  }

  reload() {
    //console.log('HomeComponent.reload(' + this.org + ')');
    for (var i = 0; i < this.orgs.length; i++) {
      if (this.orgs[i]['login'] === this.org) this.organization = this.orgs[i];
    }

    this.members = { page:1, view: [] };
    this.service.getPublicMembers(this.organization, this.members.page).subscribe(
      (response: any) =>  this.members.view = response,
      (error: string) => this.error.push(error)
    );

    this.repos = { page:1, view: [] };
    this.service.getPublicRepos(this.organization, this.repos.page).subscribe(
      (response: any) =>  this.repos.view = response,
      (error: string) => this.error.push(error)
    );
  }

  pageMembers(dir: number) {
    //console.log('HomeComponent.pageMembers(' + dir + ')');

    if ((dir < 0) && (this.members.page > 1)) this.members.page--;
    if ((dir > 0) && (this.members.view.length === 10)) this.members.page++;

    this.service.getPublicMembers(this.organization, this.members.page).subscribe(
      (response: any) =>  this.members.view = response,
      (error: string) => this.error.push(error)
    );
  }

  pageRepos(dir: number) {
    //console.log('HomeComponent.pageRepos(' + dir + ')');

    if ((dir < 0) && (this.repos.page > 1)) this.repos.page--;
    if ((dir > 0) && (this.repos.view.length === 10)) this.repos.page++;

    this.service.getPublicRepos(this.organization, this.repos.page).subscribe(
      (response: any) =>  this.repos.view = response,
      (error: string) => this.error.push(error)
    );
  }

  showRepo(repo: any) {
    //console.log('HomeComponent.showRepo(' + repo.name + ')');
    this.service.currentRepo = repo;
    this.router.navigate(['/detail']);
  }
}
