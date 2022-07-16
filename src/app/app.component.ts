import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RemovalAIService } from './service/removal-ai.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-background-remover';

  constructor(private spinner: NgxSpinnerService, public _BackgroundRemovingService: RemovalAIService) { }
  ngOnInit() {
  }
}
