import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";


@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, Header, Sidebar,],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
