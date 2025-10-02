import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SistemaComponent } from './components/sistema/sistema.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SistemaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FrontEnd';
}
