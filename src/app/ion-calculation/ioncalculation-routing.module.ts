import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedwaterComponent } from './feedwater/feedwater.component';
import { LayoutComponent } from './layout/layout.component';
import { ModuleselectionComponent } from './moduleselection/moduleselection.component';
import { OutputsummaryComponent } from './outputsummary/outputsummary.component';
import { PowercalculatorComponent } from './powercalculator/powercalculator.component';
import { SavedfeedwaterComponent } from './savedfeedwater/savedfeedwater.component';

const routes: Routes = [

  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: "feedwater", component: FeedwaterComponent
      },
      {
        path: "moduleselection", component: ModuleselectionComponent
      },
      {
        path: "powercalculator", component: PowercalculatorComponent
      },
      {
        path: "ouputsummary", component: OutputsummaryComponent
      },
      {
        path: "savedapplication", component: SavedfeedwaterComponent
      },
      {
        path: "", redirectTo: "savedapplication"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class IoncalculationRoutingModule { }
