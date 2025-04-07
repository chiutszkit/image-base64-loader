// image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiKey } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getBase64Image(url: string): Observable<string> {
    const httpHeaders = new HttpHeaders().set('Accept', 'image/webp,*/*').set('x-api-key', apiKey);
    return this.http.get(url, { headers: httpHeaders, responseType: 'text' });
  }

}