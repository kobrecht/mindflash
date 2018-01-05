import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GithubService } from '../service/github.service';

@Component({
  selector: 'login-modal',
  templateUrl: 'login.component.html',
  styleUrls: ['../config/input-required.css']
})
export class LoginComponent {
  private error: string[] = [];
  private oauth: string;

  constructor(private service: GithubService, private router: Router) { }

  login() {
    //console.log('LoginComponent.login(' + this.oauth + ')');
    this.error = [];

    this.service.login(this.oauth).subscribe(
      status => { this.router.navigate(['/home']); },
      err => { this.error.push(err.message); }
    );
  }
}
