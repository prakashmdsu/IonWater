import { Component, OnInit } from '@angular/core';
import { FeedWaterInputService } from '../services/feedwater.service';
import { PowercalculatorSummary } from './share/power-calculator-summary';

@Component({
  selector: 'app-estimatedpowerrequirements',
  templateUrl: './estimatedpowerrequirements.component.html',
  styleUrls: ['./estimatedpowerrequirements.component.css']
})
export class EstimatedpowerrequirementsComponent implements OnInit {
  powercCalculatorSummary: PowercalculatorSummary = {};
  constructor(private powerCalculatorOutputSummary: FeedWaterInputService
  ) { }

  ngOnInit(): void {
    this.powerCalculatorOutputSummary.powerCalulatorOutputSummary$.subscribe(powerccalculatorsummary => {
      this.powercCalculatorSummary = powerccalculatorsummary;
    })
  }

}
