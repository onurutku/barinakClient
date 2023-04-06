import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  subj:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  
  constructor(private http:HttpClient) { }
  login(user:any){
   return this.http.post('https://barinak.herokuapp.com/auth/login',user)
  }
}
