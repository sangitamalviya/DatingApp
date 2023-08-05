import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginatedResult } from "../_models/paginzation";
import { map } from "rxjs";

export function getPaginzatedResult<T>(url:string,params: HttpParams,http:HttpClient) {
    const paginatedReslt:PaginatedResult<T>=new PaginatedResult<T>;
    return http.get<T>(url, { observe: 'response', params }).pipe(
  
      map(response => {
        if (response.body) {
        paginatedReslt.result = response.body;
        }
        const paginatoins = response.headers.get('Pagination');
        if (paginatoins) {
        paginatedReslt.paginzations = JSON.parse(paginatoins);
        }
        return paginatedReslt;
      })
    );
  }
  
  export function getPaginzationHeader(pageNumber:number,pageSize:number) {
    let params = new HttpParams();
  
     params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
  
    return params;
  }