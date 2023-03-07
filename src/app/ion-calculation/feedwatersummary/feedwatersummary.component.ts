import { Component, Input, OnInit } from '@angular/core';
import { GenralserviceService } from 'src/app/CommonServices/genralservice.service';

import { Feedwater } from '../feedwater/Share/FeedWaterInterface';

import { FeedWaterInputService } from '../services/feedwater.service';
import { FeedWaterSummary } from './shared/feedwatersummary';

@Component({
  selector: 'app-feedwatersummary',
  templateUrl: './feedwatersummary.component.html',
  styleUrls: ['./feedwatersummary.component.css']
})
export class FeedwatersummaryComponent implements OnInit {

  constructor(
    private feedWaterService: FeedWaterInputService,
    private genrelService: GenralserviceService,
  ) { }
  feedWaterSummaryInput: Feedwater | any;
  feedWaterSummaryResult: FeedWaterSummary = {}

  ngOnInit(): void {
    this.feedWaterService.feedWaterInput$.subscribe(
      (upadtedFeedWater) => {
        this.feedWaterSummaryInput = upadtedFeedWater;
        this.feedWaterSummaryResult = this.genrelService.totalionCationAnion(upadtedFeedWater);
      }
    );
  }




}
