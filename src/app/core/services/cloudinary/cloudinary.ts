import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http'; // Import HttpBackend
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Cloudinary {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/upload';

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiUrl, formData, { responseType: 'text' });
  }
}
