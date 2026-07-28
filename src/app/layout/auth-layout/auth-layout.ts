import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthBranding } from '../../components/auth-branding/auth-branding';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet,AuthBranding],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {}
