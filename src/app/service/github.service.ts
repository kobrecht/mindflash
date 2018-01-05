import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GithubService {
    header: HttpHeaders;
    cache: {
        urls?: any,
        user?: any,
        orgs?: any[]
    };
    currentRepo: any;

    constructor(private http: HttpClient) { }

    login(token: string): Observable<any> {
        //console.log('GithubService.login()');
        delete this.header;
        this.cache = {};

        var head = new HttpHeaders().set('Authorization', 'token ' + token);

        var ret = this.http.get('https://api.github.com', { headers: head });
        ret.subscribe((response: Response) => {
            this.header = head;
            this.cache.urls = response;
        });
        return ret;
    }

    getUser(): Observable<any> {
        //console.log('GithubService.getUser()');
        if (! this.header) return Observable.throw('Not logged in');
        if (this.cache.user) return new BehaviorSubject<any>(this.cache.user);

        var ret = this.http.get(this.cache.urls.current_user_url, { headers: this.header });
        ret.subscribe((response: Response) => {
            this.cache.user = response;
        });
        return ret;
    }

    getOrgs(): Observable<any> {
        //console.log('GithubService.getOrgs()');
        if (! this.header) return Observable.throw('Not logged in');
        if (this.cache.orgs) return new BehaviorSubject<string[]>(this.cache.orgs);

        var ret = this.http.get(this.cache.urls.user_organizations_url, { headers: this.header });
        ret.subscribe((res: any[]) => this.cache.orgs = res);
        return ret;
    }

    getPublicMembers(org: any, page: number): Observable<any> {
        //console.log('GithubService.getPublicMembers(' + org.login + ', ' + page + ')');
        if (! this.header) return Observable.throw('Not logged in');

        var memurl = org.public_members_url;
        memurl = memurl.substring(0, memurl.indexOf("{"));
        if (memurl.length < 1) return Observable.throw('No matching organization');
        memurl += '?page=' + page + "&per_page=10";

        return this.http.get(memurl, { headers: this.header });
    }

    getPublicRepos(org: any, page: number): Observable<any> {
        //console.log('GithubService.getPublicRepos(' + org.login + ', ' + page + ')');
        if (! this.header) return Observable.throw('Not logged in');

        var repurl = org.repos_url;
        if (repurl.length < 1) return Observable.throw('No matching organization');
        repurl += '?page=' + page + "&per_page=10";

        return this.http.get(repurl, { headers: this.header });
    }

    getStargazers(): Observable<any> {
        if (! this.header) return Observable.throw('Not logged in');
        if (! this.currentRepo) return Observable.throw('Must come from Home');
        //console.log('GithubService.getStargazers(' + this.currentRepo.name + ')');
        
        var url = this.currentRepo.stargazers_url;
        url += '?page=1&per_page=3';

        return this.http.get(url, { headers: this.header });
    }
}