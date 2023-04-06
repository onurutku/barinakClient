import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder ,Validators} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loginForm!:FormGroup
  constructor(private fb: FormBuilder,private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.loginForm=this.fb.group({
      email:[null,Validators.required],
      password:[null,Validators.required]
    })
  }
  login(){
    const user={
      email:this.loginForm.get('email')?.value,
      password:this.loginForm.get('password')?.value
    }
    this.authService.login(user).subscribe((response:any)=>{
      this.authService.subj.next(response);
      localStorage.setItem('user',JSON.stringify(user));
      this.router.navigate([''])
    })
  }

}
