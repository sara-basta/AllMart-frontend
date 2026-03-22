import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http'; // Import HttpBackend
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Cloudinary {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/upload`;

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiUrl, formData, { responseType: 'text' });
  }
}
