/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CalculateRankingNew } from './calculateRankingNew.service';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';
import { MockData } from './mockData';

describe("calculateRankingNew service",()=>{
    let service : CalculateRankingNew;
    let mockData : MockData = new MockData();

    beforeEach(()=>{service = new CalculateRankingNew(mockData.players(), mockData.tournaments());})

    it('Brysons score should be 8', () => {
        expect(service.addTotalScore().find((player)=>{
            return player.firstName === "Bryson";
        }).overallScore).toEqual(8);
    });

    it("Should determine overall rank of 1 for bryson, 9 for clay", () =>{
        expect(service.determineOverallRank().find((player)=>{
            return player.firstName === "Bryson";
        }).overallRanking).toEqual(1);

        expect(service.determineOverallRank().find((player)=>{
            return player.firstName === "Clay";
        }).overallRanking).toEqual(9);
    });


});