import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenralserviceService } from '../../CommonServices/genralservice.service';
import { PowercalculatorSummary } from '../estimatedpowerrequirements/share/power-calculator-summary';
import { Feedwater } from '../feedwater/Share/FeedWaterInterface';
import { FeedWaterSummary } from '../feedwatersummary/shared/feedwatersummary';
import { ModuleSize } from '../moduleselection/Share/ModuleSize';
import { ModuleFeedWater } from '../moduleselection/Share/ModuleSlection';
import { FeedWaterInputService } from '../services/feedwater.service';
import { ICurrentEfficiency, ListCurrentEfficiency } from './Share/current-efficiency';
import { PowerCalculatorService } from './Share/Power-Calculator-Service.service';
import { PowerCalculator } from './Share/PowerCalculator';

@Component({
  selector: 'app-powercalculator',
  templateUrl: './powercalculator.component.html',
  styleUrls: ['./powercalculator.component.css']
})
export class PowercalculatorComponent implements OnInit {
  feedwaterInput: Feedwater = {};
  feedWaterSummaryResult: FeedWaterSummary = {};
  moduleSizeRecord: ModuleSize | any = {}
  moduleSizeData: ModuleFeedWater = {};
  powerCalculatorSummary: PowercalculatorSummary = {};
  listCuurentEfficiency: ICurrentEfficiency[] = ListCurrentEfficiency;
  voltage = 0;
  hidenFlowperModule = 0;
  currentTouse = 0;
  startupCurrentBeforeLimatation = 0;

  constructor(private router: Router, private fb: FormBuilder,
    private services: PowerCalculatorService<PowerCalculator>,
    private genrelService: GenralserviceService,
    private feedwaterService: FeedWaterInputService,
    private route: ActivatedRoute) { }

  powerCalculatorFg = this.fb.group({
    id: [''],
    feedwaterId: ['', Validators.required],
    currentEfficiency: ['', Validators.required],
    currentInput: ['', Validators.required],
    manualCurrentInput: [0],
  });
  ngOnInit(): void {

    this.feedwaterService.restoreFeedwaterInput();
    this.feedwaterService.feedWaterInput$.subscribe(feedWaterInputResult => {
      this.feedwaterInput = feedWaterInputResult;
      this.feedWaterSummaryResult = this.genrelService.totalionCationAnion(feedWaterInputResult);
    })
    this.feedwaterService.moduleSelectionInput$.subscribe(ModuleSelectionInputResult => {
      console.log(ModuleSelectionInputResult);
      this.moduleSizeData = ModuleSelectionInputResult;
    })

    this.feedwaterService.moduleSizeRecord$.subscribe(ModuleSelectionRecord => {
      this.moduleSizeRecord = ModuleSelectionRecord;
    })
  
    if (this.route.snapshot.queryParamMap.get("id") == '') {
      this.router.navigate(["/feedwater"]);
    }
    else {
      this.powerCalculatorFg.patchValue({
        feedwaterId: this.route.snapshot.queryParamMap.get("id")
      })
      if (this.route.snapshot.queryParamMap.get("id") !== '') {
        this.services.HttpGet("powercalulator/" + this.route.snapshot.queryParamMap.get("id")).subscribe(res => {
          this.powerCalculatorFg.patchValue(res);
          this.calculation();

        }, err => {

        })
      }
    }
  }

  savePowerCalculator() {
    if (this.powerCalculatorFg.value.id === '') {
      this.services.HttpPost(this.powerCalculatorFg.value, "powercalulator").subscribe(res => {
        this.router.navigate(["home/ouputsummary/"], {
          queryParams: { id: this.route.snapshot.queryParamMap.get("id") },
        });
      }, err => {

      });
    }
    else {
      this.services.HttpPut(this.powerCalculatorFg.value, "powercalulator/" + this.powerCalculatorFg.value.id).subscribe(res => {
        this.router.navigate(["home/ouputsummary/"], {
          queryParams: { id: this.route.snapshot.queryParamMap.get("id") },
        });
      }, err => {

      });
    }

  }
  Back() {
    this.router.navigate(["home/moduleselection/"], {
      queryParams: { id: this.powerCalculatorFg.value.feedwaterId },
    });
  }

  calculation() {
    {

      let tempFeedwater,
        currentEfficiency = 0,
        maxFCE,
        minFlow,
        maxFlow,
        maxCurrent,
        tempCorectionFactor,
        minTemp,
        maxTemp,
        numberOfStacks,
        cellResistance,
        tempCorrection,
        cellResistanceTempcomp,
        stackResistance,
        number_cells_stack,
        temperature,
        moduleResistance,
        txtCalculatedCurrentInput

      if (this.feedwaterInput.tempUnit == "°F") {
        tempFeedwater = ((Number(this.feedwaterInput.temp)) - 32.0) * (5.0 / 9.0);
      }
      else {
        tempFeedwater = (Number(this.feedwaterInput.temp));
      }
      number_cells_stack = Number(this.moduleSizeRecord.diluteCellsperStack);


      if (this.powerCalculatorFg.value.currentEfficiency == "Micro-E") {
        currentEfficiency = 5;
      }
      else if (this.powerCalculatorFg.value.currentEfficiency == "Power") {
        currentEfficiency = 10;
      }
      else if (this.powerCalculatorFg.value.currentEfficiency == "HI") {
        currentEfficiency = 10;
      }
      else if (this.powerCalculatorFg.value.currentEfficiency == "Pharmaceutical-non-HI") {
        currentEfficiency = 15;
      }
      else if (this.powerCalculatorFg.value.currentEfficiency == "Other") {
        currentEfficiency = 20;
      }

      if (this.feedwaterInput.tempUnit == "1") {
        temperature = Number(((Number(this.feedwaterInput.temp) - 32) *
          5 / 9).toFixed(1));
      }
      else {
        temperature = Number(this.feedwaterInput.temp);
      }

      maxFCE = Number(this.moduleSizeRecord.maxFCE);
      minFlow = Number(this.moduleSizeRecord.minFlow);
      maxFlow = Number(this.moduleSizeRecord.maxFlow);
      maxCurrent = Number(this.moduleSizeRecord.maxCurrent);
      // calcualtion for hidden flow per module
      tempCorectionFactor = Number(this.moduleSizeRecord.tempertaureCorection);
      minTemp = Number(this.moduleSizeRecord.minTemp);
      maxTemp = Number(this.moduleSizeRecord.maxTemp);
      numberOfStacks = Number(this.moduleSizeRecord.stacksperModule);

      // calculation for cell resistance
      // if (ddlModuleFamilyPC.SelectedValue == "2") {
      if (this.moduleSizeRecord.moduleFamilyId == "2") {

        cellResistance = Number((((-5.276 * Math.pow(10, -6) * Math.pow(temperature, 3) +
          4.833 * Math.pow(10, -4) * Math.pow(temperature, 2) - 0.01525 * temperature + 0.1991) * Number(this.feedWaterSummaryResult.feedWaterConductivity) +
          (-6.92 * Math.pow(10, -4) * Math.pow(temperature, 2) - 0.005221 * temperature + 5.79)) * 0.1).toFixed(8));
      }
      // else if (ddlModuleFamilyPC.SelectedValue == "4")
      else if (this.moduleSizeRecord.moduleFamilyId == "4") {

        if (this.moduleSizeData.moduleSize == "20" ||
          this.moduleSizeData.moduleSize == "21" ||
          this.moduleSizeData.moduleSize == "22") {

          cellResistance = Number((1.33 + (0.01675 * Number(this.feedWaterSummaryResult.feedWaterConductivity))).toFixed(3));
        }
        else {
          cellResistance = 0;
        }
      }
      // else if (ddlModuleFamilyPC.SelectedValue == "5")
      else if (this.moduleSizeRecord.moduleFamilyId == "5") {

        if (this.moduleSizeData.moduleSize == "29" || this.moduleSizeData.moduleSize == "25"
          || this.moduleSizeData.moduleSize == "30" || this.moduleSizeData.moduleSize == "31") {

          cellResistance = Number((((3.246 * Math.pow(10, -5) * Math.pow(temperature, 2) - 0.002849 * temperature + 0.08247) * Number(this.feedWaterSummaryResult.feedWaterConductivity)
            + (-0.0525 * temperature + 5.6639)) * 0.1).toFixed(2));
        }
        else if (this.moduleSizeData.moduleSize == "23" || this.moduleSizeData.moduleSize == "24") {

          cellResistance = Number((1.33 + (0.01675 * Number(this.feedWaterSummaryResult.feedWaterConductivity))).toFixed(3));

        }
        else {
          cellResistance = 0;
        }
      }
      else {
        cellResistance = 0;
      }

      // claculation hidden flow module
      // if (ddlFlowPC.SelectedValue == "1")
      if (this.moduleSizeData.flow == "english") {
        this.hidenFlowperModule = Number((Number(this.moduleSizeData.flowPerModule) * 3.785).toFixed(3));
      }
      //this is for metric lph 

      else if (this.moduleSizeData.flow == "metric" && this.moduleSizeRecord.moduleFamilyId == "1") {
        this.hidenFlowperModule = Number((Number(this.moduleSizeData.flowPerModule) / 60).toFixed(3));
      }
      //this is for metric m3h 
      else {

        this.hidenFlowperModule = Number((Number(this.moduleSizeData.flowPerModule) * 16.667).toFixed(3));

      }
      // temperature calculation
      // calculation of temp correction
      tempCorrection = (1 + (10 * tempCorectionFactor)) - (temperature * tempCorectionFactor);
      // cell resistance temp comp
      cellResistanceTempcomp = (cellResistance * tempCorrection);
      // calculation of stack resistance
      stackResistance = cellResistanceTempcomp * number_cells_stack;

      //Modified as per redmine ticket #26067

      if (this.powerCalculatorFg.value.currentInput == "UseCalculatedStartupCurrent") {
        this.startupCurrentBeforeLimatation = (1.31 * this.hidenFlowperModule * Number(this.feedWaterSummaryResult.feedWaterConductivity))
          / (number_cells_stack * currentEfficiency);
      }
      else {
        this.startupCurrentBeforeLimatation = Number(this.powerCalculatorFg.value.manualCurrentInput);
      }

      // calculation of module resistance
      moduleResistance = stackResistance / numberOfStacks;
      // current to use for calculation

      if (this.powerCalculatorFg.value.currentInput == "UseCalculatedStartupCurrent") {

        if (this.moduleSizeData.moduleSize == "23" || this.moduleSizeData.moduleSize == "24") {

          if ((Number(this.feedWaterSummaryResult.totalHardnessCaCO3) >= 0.0 && Number(this.feedWaterSummaryResult.totalHardnessCaCO3) <= 1.0)
            && (Number(this.feedwaterInput.siO2) >= 0.0 && Number(this.feedwaterInput.siO2) <= 1.0)) {
            this.currentTouse = this.moduleSizeData.moduleSize == "23" ? 6 : 12;

          }
          else if ((Number(this.feedWaterSummaryResult.totalHardnessCaCO3) > 1.0 && Number(this.feedWaterSummaryResult.totalHardnessCaCO3) <= 2.5)
            || (Number(this.feedwaterInput.siO2) > 1.0 && Number(this.feedwaterInput.siO2) <= 1.5)) {
            this.currentTouse = this.moduleSizeData.moduleSize == "23" ? 4 : 8;

          }
          else if ((Number(this.feedWaterSummaryResult.totalHardnessCaCO3) > 2.5 && Number(this.feedWaterSummaryResult.totalHardnessCaCO3) <= 4.0)
            || (Number(this.feedwaterInput.siO2) > 1.5 && Number(this.feedwaterInput.siO2) <= 2.0)) {
            this.currentTouse = this.moduleSizeData.moduleSize == "23" ? 2 : 4;
          }
        }
        //This has been edited as per the ticket #26067
        else if (this.startupCurrentBeforeLimatation < Number(this.moduleSizeRecord.minStartupCurrent)) {
          txtCalculatedCurrentInput = (this.moduleSizeRecord.minStartupCurrent);
          this.currentTouse = Number(this.moduleSizeRecord.minStartupCurrent);
        }
        else if ((this.startupCurrentBeforeLimatation > Number(this.moduleSizeRecord.minStartupCurrent) &&
          (this.startupCurrentBeforeLimatation < maxCurrent))) {

          txtCalculatedCurrentInput = (this.startupCurrentBeforeLimatation).toFixed(2);
          this.currentTouse = this.startupCurrentBeforeLimatation;
        }
        else {
          txtCalculatedCurrentInput = maxCurrent;
          this.currentTouse = maxCurrent;
        }
      }
      else {
        this.currentTouse = Number(this.powerCalculatorFg.value.manualCurrentInput);
      }
      // calculation of voltage
      //commented as per the redmine ticket number 20963
      //Convert farehent to celcius
      this.voltage =  Math.round((Number(this.moduleSizeRecord.maxVoltage)) * (1 - (tempFeedwater - Number(minTemp)) * (0.02)));
    }
  }

  calculatePower() {
    this.calculation()
    let ACDCRectifierEfficiency = 0.93;
    // modifed withreffrence to redmine ticket #20601 85% to 93%
    //Power_consumption_dckw_module 
    this.powerCalculatorSummary.PowerConsumptionDckwModule = ((this.voltage * this.currentTouse * 1) / 1000);
    // Power_consumption_dckw_mcube
    this.powerCalculatorSummary.PowerConsumptionDckwMcube = ((this.voltage * this.currentTouse) / (this.hidenFlowperModule / 16.677) / 1000).toFixed(2);
    // Power_consumption_dckw_kgal
    this.powerCalculatorSummary.PowerConsumptionDckwKgal = ((this.voltage * this.currentTouse) / (this.hidenFlowperModule * (60 / (3.785 * 1000))) / 1000).toFixed(2);
    // Power_consumption_ACkw_module
    this.powerCalculatorSummary.PowerConsumptionACkwModule = (this.powerCalculatorSummary.PowerConsumptionDckwModule / ACDCRectifierEfficiency).toFixed(2);
    // Power_consumption_ACkw_mcube =
    this.powerCalculatorSummary.PowerConsumptionACkwMcube = (Number(this.powerCalculatorSummary.PowerConsumptionDckwMcube) / ACDCRectifierEfficiency).toFixed(2);
    // Power_consumption_ACkw_kgal
    this.powerCalculatorSummary.PowerConsumptionACkwKgal = (Number(this.powerCalculatorSummary.PowerConsumptionDckwKgal) / ACDCRectifierEfficiency).toFixed(2);
    // txtAcPowerConsumption =
    this.powerCalculatorSummary.AcPowerConsumption =
      (this.powerCalculatorSummary.PowerConsumptionACkwModule);

    // txtTotalACPowerConsumptionPerDay =
    this.powerCalculatorSummary.TotalACPowerConsumptionPerDay =
      (((this.voltage * this.currentTouse / 1000) / ACDCRectifierEfficiency) * Number(this.moduleSizeData.numberOfModule) * 24).toFixed(2);

    // txtDCPowerConsumption1 =
    this.powerCalculatorSummary.DCPowerConsumption1 = (this.powerCalculatorSummary.PowerConsumptionDckwKgal);
    this.powerCalculatorSummary.DCPowerConsumption2 = this.powerCalculatorSummary.PowerConsumptionDckwMcube;
    if (this.voltage < Number(this.moduleSizeRecord.minVoltage)) {
      this.powerCalculatorSummary.estimatedvoltage = (this.moduleSizeRecord.minVoltage);
    }
    else {
      this.powerCalculatorSummary.estimatedvoltage = (this.voltage).toString();
    }
    if (this.startupCurrentBeforeLimatation < Number(this.moduleSizeRecord.minStartupCurrent)) {
      this.powerCalculatorSummary.estimatedstartupcurrent = this.moduleSizeRecord.minStartupCurrent;
    }
    else {
      this.powerCalculatorSummary.estimatedstartupcurrent = (this.currentTouse).toFixed(1);
    }

    this.feedwaterService.updatePowerCalculatorOutput(this.powerCalculatorSummary);
  }
}
