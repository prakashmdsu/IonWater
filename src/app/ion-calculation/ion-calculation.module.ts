import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedwaterComponent } from './feedwater/feedwater.component';
import { ModuleselectionComponent } from './moduleselection/moduleselection.component';
import { PowercalculatorComponent } from './powercalculator/powercalculator.component';
import { OutputsummaryComponent } from './outputsummary/outputsummary.component';
import { FeedwatersummaryComponent } from './feedwatersummary/feedwatersummary.component';
import { EstimatedpowerrequirementsComponent } from './estimatedpowerrequirements/estimatedpowerrequirements.component';
import { SavedfeedwaterComponent } from './savedfeedwater/savedfeedwater.component';
import { WarningmessageComponent } from './warningmessage/warningmessage.component';
import { IoncalculationRoutingModule } from './ioncalculation-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationbarComponent } from './navigationbar/navigationbar.component';


@NgModule({
  declarations: [
    FeedwaterComponent,
    ModuleselectionComponent,
    PowercalculatorComponent,
    OutputsummaryComponent,
    FeedwatersummaryComponent,
    EstimatedpowerrequirementsComponent,
    SavedfeedwaterComponent,
    WarningmessageComponent,
    LayoutComponent,
    NavigationbarComponent,

  ],
  imports: [
    CommonModule,
    IoncalculationRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class IonCalculationModule { }
