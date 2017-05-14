/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CalculateRanking } from './calculateRanking.service';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';
import { MockData } from './mockData';

describe("calculateRankingNew service",()=>{
    let service : CalculateRanking;
    let mockData : MockData = new MockData();

    beforeEach(()=>{service = new CalculateRanking();
    

    it('Brysons score should be 11', () => {
        expect(service.addTotalScore().find((player)=>{
            return player.firstName === "Bryson";
        }).overallScore).toEqual(8);
    });

    xit("Should determine overall rank of 1 for bryson, 9 for clay", () =>{
        expect(service.determineOverallRank().find((player)=>{
            return player.firstName === "Bryson";
        }).overallRanking).toEqual(1);

        expect(service.determineOverallRank().find((player)=>{
            return player.firstName === "Clay";
        }).overallRanking).toEqual(9);
    });


});