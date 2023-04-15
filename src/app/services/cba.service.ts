import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CBAService {

  constructor(private _httpClient:HttpClient, private _auth:AuthService) { 

  }

  headers = new HttpHeaders({
    'Authorization': `${this._auth.token()}`
  });
  requestOptions:object = { 
    headers: this.headers 
    , observe: 'response'
  };


  getCBA(mediaType:string, currentPage:number, pageSize:number,additional:string=''):Observable<any> {
    return this._httpClient.get(`https://goodreads.onrender.com/${mediaType}/?page=${currentPage}&limit=${pageSize}${additional}`, this.requestOptions);
  }
  getPopularCBA(mediaType:string):Observable<any> {
    return this._httpClient.get(`https://goodreads.onrender.com/${mediaType}/popular`, this.requestOptions);
  }

  getByID(mediaType:string, id:string,additional:string=''):Observable<any> {
    return this._httpClient.get(`https://goodreads.onrender.com/${mediaType}/${id}${additional}`, this.requestOptions);
  }
  
  deleteCBA(mediaType:string, id:string):Observable<any> {
    return this._httpClient.delete(`https://goodreads.onrender.com/${mediaType}/${id}`, this.requestOptions);
  }

  patchCBA(mediaType:string, id:string, FormData:object):Observable<any> {
    return this._httpClient.patch(`https://goodreads.onrender.com/${mediaType}/${id}`, FormData, this.requestOptions);
  }

  postCBA(mediaType:string, FormData:object):Observable<any> {
    return this._httpClient.post(`https://goodreads.onrender.com/${mediaType}`, FormData, this.requestOptions);
  }

  postUser(mediaType:string, FormData:object):Observable<any> {
    return this._httpClient.post(`https://goodreads.onrender.com/${mediaType}`, FormData, {observe: 'response'});
  }

  addReview(id:string, FormData:object):Observable<any> {
    return this._httpClient.patch(`https://goodreads.onrender.com/book/${id}/review`, FormData , this.requestOptions);
  }
  updateReview(id:string, FormData:object):Observable<any> {
    return this._httpClient.patch(`https://goodreads.onrender.com/book/${id}/review/edit`, FormData , this.requestOptions);
  }

}
