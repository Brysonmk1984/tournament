import { Pipe, PipeTransform } from '@angular/core';
import placementSuffix from "../utility/placementSuffix";

@Pipe({name : "suffix"})
export class SuffixPipe implements PipeTransform {

     transform(value, args:string[]) : any {
         if (!value) {
           return value;
         } 
         return value + placementSuffix(value);
       } 
    

}