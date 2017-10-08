import { Pipe, PipeTransform } from '@angular/core';
import placementSuffix from "../utility/placementSuffix";

@Pipe({name : "round"})
export class RoundPipe implements PipeTransform {

     transform(value, args:string[]) : any {
         if (!value) {
           return value;
         } 
           return value.toFixed(1)
       } 
}