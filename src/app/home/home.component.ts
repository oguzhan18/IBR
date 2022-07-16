import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RemovalAIService } from '../service/removal-ai.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imageError!: any;
  isImageSaved!: boolean;
  cardImageBase64!: any;
  filePath!: string;

  constructor(
    private router: Router,
    public _BackgroundRemovingService: RemovalAIService
  ) { }

  ngOnInit(): void {
  }

  Gotoprice() {
    this.router.navigate(['/pricing']);
  }

  Gotouploadimage() {
    this.router.navigate(['/imageupload']);
  }
}



