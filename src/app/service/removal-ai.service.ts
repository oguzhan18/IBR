import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from, Observer } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RemovalAIService {

  httpOptions: any;

  constructor(
    public _http: HttpClient
  ) { }

  convertImageUsingRemovalAI(data: any) {
    this.httpOptions = new HttpHeaders({
      'Rm-Token': environment.removalAiToken,
    })
    return this._http.post<any>(
      environment.removalAI,
      data,
      {
        headers: this.httpOptions
      }
    )
      .pipe(catchError(this.errorHandler))
  }

  getConvertedImage(url: any) {
    return this._http.get(url).pipe(catchError(this.errorHandler))
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx:any = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error)
  }
}
