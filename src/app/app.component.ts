import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageService } from 'src/services/image.service';
import { myApiKey, myApiServer } from 'src/app/postman.config';

const apiKey: string = myApiKey; //Use your own API key here
const serverUrl: string = myApiServer; // Define your own postman API server

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'image-error-handle';
  image = 'https://picsum.photos/300/200';
  image_url = myApiServer +'/getImage'; 
  
  //http
  imageURLHttp?: string;
  imageSrcHttp?: string;
  imageErrorCodeHttp: number = 0;
  isImageLoadingHttp = false;
  //imageService
  isImageErrorIS = false;
  isImageLoadingIS = false;
  imageSrcIS?: string;
  //fetch
  imageSrc?: string;
  imageErrorCode: number = 0;
  isImageLoadingFetch = false;

  constructor(private http: HttpClient, private imageService: ImageService) {}

  ngOnInit() {
    this.getImages();
  }

  reset() {
    this.imageErrorCodeHttp = 0;
    this.imageErrorCode = 0;
    this.imageSrc = '';
    this.imageSrcHttp = '';
    this.imageSrcIS='';
  }

 getImages() {
  this.reset();

  this.getHTTPImageBase64();
  this.getFetchImageBase64();
  this.isImageLoadingIS = true;
  this.imageService.getBase64Image(this.image_url).subscribe({
    next: (response) => {
      this.isImageLoadingIS = false;
      this.imageSrcIS = response;
    },
    error: (error) => {
      this.isImageErrorIS = true;
      this.isImageLoadingIS = false;
    }
  })
 }

  changeUri(options?: {ok?: boolean; notfound?: boolean; networkerror?:boolean}) {
    if (options && options.ok) {
      this.image_url = myApiServer,'/getImage';
    } else if (options && options.notfound) {
      this.image_url = myApiServer,'/getImageNotFound';
    } else if (options && options.networkerror) {
      this.image_url = myApiServer,'/getImageNetworkError';
    }
    this.getImages();
  }

  getHTTPImageBase64() {
    let httpHeaders = new HttpHeaders().set('Accept', 'image/webp,*/*').set('x-api-key', apiKey);
    this.isImageLoadingHttp = true;

    return this.http
      .get(this.image_url, {
        headers: httpHeaders,
        responseType: 'text'
      })
      .subscribe({
        next: (response) => {
          this.isImageLoadingHttp = false;
          this.imageSrcHttp = response;
        },
        error: (error) => {
          this.isImageLoadingHttp = false;
          this.imageErrorCodeHttp = error.status;
        }
      });
  }

  async getFetchImageBase64() {
    this.isImageLoadingFetch = true;
    try {
      const response = await fetch(this.image_url, { 
        method: 'GET',
        headers: {
          "Accept": "image/webp,*/*",
          "x-api-key": apiKey,
        }
      });
      this.imageErrorCode = response.status;
      if (response.status === 200) {
        this.imageSrc = await response.text();
      }
    } catch (error: any) {
      console.error(error.message);
    }
    this.isImageLoadingFetch = false;
  }
}
