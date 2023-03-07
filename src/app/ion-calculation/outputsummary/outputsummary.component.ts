import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { GenralserviceService } from 'src/app/CommonServices/genralservice.service';
import { Feedwater } from '../feedwater/Share/FeedWaterInterface';
import { FeedWaterSummary } from '../feedwatersummary/shared/feedwatersummary';
import { ModuleSize } from '../moduleselection/Share/ModuleSize';
import { ModuleFeedWater } from '../moduleselection/Share/ModuleSlection';
import { FeedWaterInputService } from '../services/feedwater.service';
import { OutputSummary } from './shared/outpusummmary';
import { PDFLABELS } from './shared/pdflabels';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-outputsummary',
  templateUrl: './outputsummary.component.html',
  styleUrls: ['./outputsummary.component.css']
})
export class OutputsummaryComponent implements OnInit {

  cellmod = 0;
  //calculation of N49
  N49 = 0;
  N50 = 0;
  O_50 = 0;
  O_51 = 0;
  O_53 = 0;
  O_49 = 98;
  Tds = 0
  N51 = 0;
  cells = 0;
  iflow = 0;
  gpmcell = 0;
  meghaohm = 0;
  silRem = 0;
  itemp = 0;
  Nom = 0;
  min = 0;
  max = 0;
  saltpasageTest1 = 0;
  saltpasageTest2 = 0;
  feedwaterConductivity = 0;
  commonmultply = 1000;
  pdflabels = PDFLABELS[0];
  feedwaterInput: Feedwater = {};
  cmnCalc: FeedWaterSummary = {};
  moduleSizeRecord: ModuleSize | any = {}
  moduleSizeData: ModuleFeedWater = {};
  outputSummaryData: OutputSummary | any = {}
  flowPerModule = 0.0;
  maxRecov2 = 0.0;
  maxRecov1 = 0.0;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private genrelService: GenralserviceService,
    private feedwaterService: FeedWaterInputService,
  ) { }

  ngOnInit(): void {
    this.feedwaterService.restoreFeedwaterInput();
    this.feedwaterService.feedWaterInput$.subscribe(feedWaterInputResult => {
      this.feedwaterInput = feedWaterInputResult;
    })
    this.feedwaterService.moduleSelectionInput$.subscribe(ModuleSelectionInputResult => {
      this.moduleSizeData = ModuleSelectionInputResult;
      console.log(this.moduleSizeData);
    })

    this.feedwaterService.moduleSizeRecord$.subscribe(ModuleSelectionRecord => {
      this.moduleSizeRecord = ModuleSelectionRecord;
    })
    this.cmnCalc = this.genrelService.totalionCationAnion(this.feedwaterInput)
    let cellmod;
    //calculation of N49

    this.Tds = Number(this.cmnCalc.tds);
    this.feedwaterConductivity = Number(this.cmnCalc.feedWaterConductivity);
    this.flowPerModule = Number(this.moduleSizeData.flowPerModule)

    if (this.moduleSizeData.moduleFamily === "1") {
      this.mxCalculation();
    }
    //for vnx
    else if (this.moduleSizeData.moduleFamily === "3") {
      this.VNX28EP()
      // this.VNX55EP();
      // this.VNX55EX();
      // this.VNX55HH();
      // this.VNX15CDIT();
      // this.VNX55E();
    }
    //for lxm
    else if (this.moduleSizeData.moduleFamily === "2") {
      this.calculatLxM();
      this.HWS_LXgeneration();
    }
  }
  Back() {
    this.router.navigate(["home/powercalculator/"], {
      queryParams: { id: this.route.snapshot.queryParamMap.get("id") },
    });
  }
  mxCalculation() {

    // calculation of N49
    if (Number(this.cmnCalc.feedWaterConductivity) <= 15) {
      this.N49 = (17 - (this.Tds / 15));
      this.N50 = (17 - (Number(this.cmnCalc.feedWaterConductivity) / 15));
    }
    else {
      this.N49 = 22 - (0.4 * Number(this.cmnCalc.feedWaterConductivity));
      if (Number(this.cmnCalc.feedWaterConductivity) <= 30 && (Number(this.cmnCalc.feedWaterConductivity) > 15)) {
        this.N50 = 24 - (16 * (Number(this.cmnCalc.feedWaterConductivity)) / 30);
      }
      else {
        this.N50 = 14 - 0.2 * Number(this.cmnCalc.feedWaterConductivity);
      }
    }

    if (Number(this.cmnCalc.feedWaterConductivity) <= 20) {
      this.N51 = (17 - (0.75 * Number(this.cmnCalc.feedWaterConductivity)));
    }
    else {
      this.N51 = 3 - 0.05 * Number(this.cmnCalc.feedWaterConductivity);
    }
    //  calculation of cells for gpm cells
    if (this.moduleSizeData.moduleSize == "1") {
      this.cells = 2;
    }
    else if (this.moduleSizeData.moduleSize == "2") {
      this.cells= 4;
    }
    else if (this.moduleSizeData.moduleSize == "3") {
      this.cells = 8;
    }
    else if (this.moduleSizeData.moduleSize == "4") {
      this.cells = 16;
    }
    else if (this.moduleSizeData.moduleSize == "5") {
      this.cells = 32;
    }
    this.cells = this.cells  * Number(this.moduleSizeData.numberOfModule);
    if (this.cells
      == 0) {
      this.cells
        = 1;
    }
    if (this.cells
      == 32) {
      this.iflow = 0.103125;
    }
    else {
      this.iflow = 0.1375;
    }
    if (this.moduleSizeData.flow == "english") {
      this.gpmcell = Number((Number(this.moduleSizeData.productFlowRate) / this.cells
      ).toFixed(3));
    }
    else {
      this.gpmcell = Number(((Number(this.moduleSizeData.productFlowRate) * 0.0044) / this.cells
      ).toFixed(3));
    }
    if (this.gpmcell == 0.03375) {
      this.meghaohm = this.N49;
    }
    else if (this.gpmcell == 0.06875) {
      this.meghaohm = this.N50;
    }
    else if (this.gpmcell > 0.03375 && this.gpmcell < 0.068) {
      this.meghaohm = (this.gpmcell - 0.03375) / 0.06875 * (this.N50 - this.N49) + this.N49;
    }
    else {
      this.meghaohm = (this.gpmcell - 0.06875) / 0.1375 * (this.N51 - this.N50) + this.N50;
    }

    this.saltpasageTest1 = Number(this.cmnCalc.feedWaterConductivity) > 0 ?
      (1 / this.meghaohm / Number(this.cmnCalc.feedWaterConductivity)) : 0;

    this.saltpasageTest2 = this.saltpasageTest1 > 1 ? 0.005 : this.saltpasageTest1;

    this.O_50 = Number(this.cmnCalc.feedWaterConductivity) <= 30 ?
      97 :
      (103 - (0.2 * Number(this.cmnCalc.feedWaterConductivity)));

    this.O_51 = Number(this.cmnCalc.feedWaterConductivity) <= (10) ? 95 : (100 - (0.5 * Number(this.cmnCalc.feedWaterConductivity)));

    if (this.gpmcell > 0.034375 && this.gpmcell < 0.06875) {
      this.O_53 = (this.gpmcell - 0.034375) / 0.034375 * (this.O_50 - this.O_49) + this.O_49;
    }
    else {
      this.O_53 = (this.gpmcell - 0.06875) / 0.06875 * (this.O_51 - this.O_50) + this.O_50;
    }
    this.silRem = this.O_53;
    let SiO2Out = ((1 - (this.silRem / 100)) * (Number(this.feedwaterInput.siO2) * 1000));

    this.outputSummaryData.SIO2Ouput = (((1 - (this.silRem / 100)) * (Number(this.feedwaterInput.siO2) * 1000), 1)) < 5 ? "<5" : "NA";
    if (((1 - (this.silRem / 100)) * (Number(this.feedwaterInput.siO2) * 1000), 1) < 5) {
      this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" : "<5";
    }
    else {
      this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" : "NA";
    }

    // D/P calculation
    if (this.moduleSizeData.flow == "english") {
      this.outputSummaryData.DPOuput = this.moduleSizeData.pressure == "psi" ?
        (3.5 * Math.exp(22 * this.gpmcell)).toString()
        : (3.5 * Math.exp(22 * this.gpmcell) * 0.06895).toString();
    }
    else {
      this.outputSummaryData.DPOuput = this.moduleSizeData.pressure == "psi" ?
        (3.5 * Math.exp(22 * this.gpmcell)).toString()
        : (3.5 * Math.exp(22 * this.gpmcell) * 0.06895, 1).toString();
    }

    // MX_recov_ouput_sugested = maxRecoveryCalc.maxRecovery(Hardness,     Number(this.feedwaterInput.siO2)).ToString();
    let saltpasage = (100 * (1 - this.saltpasageTest2));
    let Saltrjectn_ouput_sugested = saltpasage;

    //    MX_recov_ouput_sugested= max_recovery.ToString();;
    this.assigningToOutput();
    // let Totalproductivity_ouput_sugested = product_flowrate.ToString();;
    // total_reject_totalfeed_totalproduct();
  }


  calculatLxM() {

    let productFlowrate = Number(this.moduleSizeData.productFlowRate);
    this.N49 = Number(this.cmnCalc.feedWaterConductivity) <= (15) ? (17 - (this.Tds / 15)) : (22 - (0.4 * Number(this.cmnCalc.feedWaterConductivity)));
    // calculation of N50
    if (Number(this.cmnCalc.feedWaterConductivity) <= 15) {
      this.N50 = (17 - (Number(this.cmnCalc.feedWaterConductivity) / 15));
    }
    else {
      if (Number(this.cmnCalc.feedWaterConductivity) <= 30 && Number(this.cmnCalc.feedWaterConductivity) > 15) {
        this.N50 = 24 - (16 * Number(this.cmnCalc.feedWaterConductivity)) / 30;
      }
      else {
        this.N50 = 14 - 0.2 * Number(this.cmnCalc.feedWaterConductivity);
      }
    }
    // calculation of N51
    this.N51 = Number(this.cmnCalc.feedWaterConductivity) <= (20) ? (17 - (0.75 * Number(this.cmnCalc.feedWaterConductivity))) : (3 - 0.05 * Number(this.cmnCalc.feedWaterConductivity));
    //  calculation of cells for gpm cells
    if (this.moduleSizeData.moduleSize == "6") {
      this.cells
        = 4;
    }
    else if (this.moduleSizeData.moduleSize == "7") {
      this.cells
        = 10;
    }
    else if (this.moduleSizeData.moduleSize == "8") {
      this.cells
        = 18;
    }
    else if (this.moduleSizeData.moduleSize == "9") {
      this.cells
        = 24;
    }
    else if (this.moduleSizeData.moduleSize == "10") {
      this.cells
        = 30;
    }
    else if (this.moduleSizeData.moduleSize == "11") {
      this.cells
        = 45;
    }

    else if (this.moduleSizeData.moduleSize == "12") {
      this.cells
        = 4;
    }

    else if (this.moduleSizeData.moduleSize == "13") {
      this.cells
        = 10;
    }

    else if (this.moduleSizeData.moduleSize == "14") {
      this.cells
        = 18;
    }
    else if (this.moduleSizeData.moduleSize == "15") {
      this.cells
        = 24;
    }
    else if (this.moduleSizeData.moduleSize == "16") {
      this.cells
        = 24;
    }
    else if (this.moduleSizeData.moduleSize == "17") {
      this.cells
        = 4;
    }
    else {
      this.cells
        = 30;
    }
    this.cellmod = this.cells
      ;
    this.cells
      = this.cells
      * Number(this.moduleSizeData.numberOfModule);
    if (this.cells
      == 0) {
      this.cells
        = 1;
    }
    this.gpmcell = this.moduleSizeData.flow == "english" ?
      Number((productFlowrate / this.cells
      ).toFixed(2)) :
      Number(((productFlowrate * 4.402868) / (this.cells
      )).toFixed(3));


    // calculation of min
    this.min = Number(this.cmnCalc.feedWaterConductivity) <= (5.1426) ?
      0.99 :
      (0.00001 * Math.pow(Number(this.cmnCalc.feedWaterConductivity), 2) - 0.0003 * Number(this.cmnCalc.feedWaterConductivity) + 0.9918);


    // calculation of nom
    this.Nom = Number(this.cmnCalc.feedWaterConductivity) <= (13.8425) ?
      0.97 :
      (0.00006 * Math.pow(Number(this.cmnCalc.feedWaterConductivity), 2) - 0.0051 * Number(this.cmnCalc.feedWaterConductivity) + 1.0291);


    this.max = Number(this.cmnCalc.feedWaterConductivity) <= (12.8342) ?
      95 :
      ((-0.2135 * Math.log10(Number(this.cmnCalc.feedWaterConductivity))) + 1.4936);


    // calculation of meggers
    let megger1 = (-0.0375 * Number(this.cmnCalc.feedWaterConductivity) + 18);
    let megger2 = (-0.075 * Number(this.cmnCalc.feedWaterConductivity) + 18);
    let megger3 = (-0.2625 * Number(this.cmnCalc.feedWaterConductivity) + 18);


    if (this.gpmcell == 0.25) {
      this.meghaohm = Number(megger1.toFixed(2));
    }
    else if (this.gpmcell < 0.5) {
      this.meghaohm = Number((megger1 - (((this.gpmcell - 0.25) / 0.25) * (megger1 - megger2))).toFixed(1));
    }
    else if (this.gpmcell == 0.5) {
      this.meghaohm = Math.round(megger2);
    }
    else if (this.gpmcell > 0.5 && this.gpmcell < 0.75) {
      this.meghaohm = megger2 - (((this.gpmcell - 0.5) / 0.25) * (megger2 - megger3));
    }
    else {
      this.meghaohm = megger3;
    }

    this.saltpasageTest1 = Number(this.cmnCalc.feedWaterConductivity) > (0) ?
      (1 / this.meghaohm / Number(this.cmnCalc.feedWaterConductivity)) :
      0;

    this.saltpasageTest2 = this.saltpasageTest1 > (1) ? 0.005 : this.saltpasageTest1;

    // IList < module_sizesystem > allmodulesize = build_module_sizesystem();


    // var MinNominalandMaxFlow = (from s in allmodulesize where s.id.Equals(IpInput.ModuleSize)
    //                             select new
    //   {
    //     minflow = flow_selected == "1" ? s.min_flow : s.min_flow_m3h,
    //     nominalflow = flow_selected == "1" ? s.nominal_flow : s.nominal_flow_m3h,
    //     maxflow = flow_selected == "1" ? s.max_flow : s.max_flow_m3h,
    //   }).First();

    //calculatopn for Sio2out 
    //Calculation changed as per redmine ticket 21377


    // var siloutfinal = silicalc.CalCulateSilicaVnxModule(flow_selected,     Number(this.feedwaterInput.siO2), (this.flowPerModule), Number(this.cmnCalc.feedWaterConductivity), Convert.ToDouble(MinNominalandMaxFlow.minflow), Convert.ToDouble(MinNominalandMaxFlow.maxflow), Convert.ToDouble(MinNominalandMaxFlow.nominalflow));
    // if (    Number(this.feedwaterInput.siO2) >= 0.5) {
    //   this.outputSummaryData.SIO2Ouput =     Number(this.feedwaterInput.siO2) == 0 ? "" : "NA";
    // }
    // else {
    //   this.outputSummaryData.SIO2Ouput =     Number(this.feedwaterInput.siO2) == 0 ? "" : siloutfinal.ToString();
    // }


    // let this.itemp  = temperature_selected == "1" ? Tempreature : (Tempreature - 32) * 0.55555;


    if (this.moduleSizeData.flow == "english") {
      this.outputSummaryData.DPOuput = Number((((27.122) * Math.pow(productFlowrate, 2)) + (49.771 * productFlowrate) - 0.564).toFixed(2));
    }
    else {
      this.outputSummaryData.DPOuput = Number((((36.213) * Math.pow(productFlowrate, 2)) + (15.103 * productFlowrate) - 0.039).toFixed(2));
    }

    // MX_recov_ouput_sugested.Text = maxRecoveryCalc.maxRecovery(Hardness,     Number(this.feedwaterInput.siO2)).ToString();
    // saltpasage = Math.Round(100 * (1 - this.saltpasageTest2), 2);
    // Saltrjectn_ouput_sugested.Text = Math.Round(saltpasage, 1).ToString();;
    // flow_permodule.Text = Math.Round(this.flowPerModule, 1).ToString();;
    // numberof_permodule_sugested.Text = Number_of_modules.ToString();;

    //    MX_recov_ouput_sugested.Text = max_recovery.ToString();;
    this.assigningToOutput();
    // Totalproductivity_ouput_sugested.Text = product_flowrate.ToString();;
    // total_reject_totalfeed_totalproduct();
  }
  HWS_LXgeneration() {
    let cellsbuffer;
    let N36, O36, R36, N41, Q36, I44, I42, I41, O41, P41;
    let ck = (0.000010512996 + 2192580.4) * Math.exp(- Number(this.feedwaterInput.pH7) / 0.43429438);
    let c2k = (-0.0000037461988 + 20111.272) * Math.exp(-Math.exp(- Number(this.feedwaterInput.pH7) / 0.43439011));
    if (this.moduleSizeData.moduleSize == "12") {
      this.cells = 4;
    }
    else if (this.moduleSizeData.moduleSize == "13") {
      this.cells = 10;
    }
    else if (this.moduleSizeData.moduleSize == "14") {
      this.cells = 18;
    }
    else if (this.moduleSizeData.moduleSize == "15") {
      this.cells = 24;
    }
    else if (this.moduleSizeData.moduleSize == "16") {
      this.cells = 30;
    }
    else if (this.moduleSizeData.moduleSize == "17") {
      this.cells = 45;
    }
    else {
      this.cells = 30;
    }
    cellsbuffer = this.cells;
    this.cells = this.cells * Number(this.moduleSizeData.numberOfModule);
    if (this.cells == 0) {
      this.cells = 1;
    }
    if (this.moduleSizeData.flow == "english") {
      this.gpmcell = Number((Number(this.moduleSizeData.productFlowRate) / this.cells).toFixed(9));
    }
    else {
      this.gpmcell = Number(((Number(this.moduleSizeData.productFlowRate) * 4.402868) / (this.cells)).toFixed(9));
    }

    if (((this.gpmcell - 0.25) < 0.01)) {
      this.gpmcell = 0.25;
    }

    if (this.feedwaterInput.tempUnit == "1") {
      this.itemp = Number(this.feedwaterInput.temp);
    }
    else {
      this.itemp = (Number(this.feedwaterInput.temp) - 32.0) * 0.55555;
    }
    N36 = Math.exp(4.56 - 0.00000753 * Math.pow(this.feedwaterConductivity, 3));
    O36 = Math.exp((4.46 + 0.004 * this.itemp) - Math.exp(-0.02179 * this.itemp - 11.2514) * Math.pow(this.feedwaterConductivity, 3));

    if (this.itemp > 25) {
      Q36 = N36;
    }
    else {
      Q36 = O36;
    }
    let S36 = 80 - (1.2 * this.feedwaterConductivity);
    if (this.gpmcell <= 0.52083333) {
      R36 = Q36;
    }
    else {
      R36 = (0.52083333 - this.gpmcell) * (S36 - Q36) / (0.52083333 - 0.78125) + Q36;
    }
    this.silRem = R36;
    N41 = 18 - (0.32 * this.feedwaterConductivity);
    if (this.feedwaterConductivity <= 25) {
      P41 = N41;
    }
    else {
      P41 = 25 - (0.6 * this.feedwaterConductivity);
    }
    O41 = (15.0 - this.itemp) * (P41 - N41) / (10.0) + N41;
    if (this.itemp >= 15) {
      I41 = N41;
    }
    else {
      I41 = O41;
    }
    if (this.feedwaterConductivity <= 25) {
      I42 = 18 - 0.56 * this.feedwaterConductivity;
    }
    else {
      I42 = 10 - 0.24 * this.feedwaterConductivity;
    }
    if (this.gpmcell <= 0.520833) {
      I44 = I41;
    }
    else {
      I44 = (0.520833 - this.gpmcell) * (I42 - I41) / (0.520833 - 0.78125) + I41;
    }
    if (this.gpmcell > 0.78125) {
      this.meghaohm = 0.1;
    }
    else {
      this.meghaohm = I44;
    }
    let Resistvity_ouput_sugested
    if (this.meghaohm == 0.1) {
      Resistvity_ouput_sugested = this.meghaohm;
    }
    else {
      Resistvity_ouput_sugested = (this.meghaohm).toFixed(2);
    }
    // calculation of nom
    if (this.itemp >= 25) {
      this.Nom = Math.exp(4.56 - 0.00000753 * Math.pow(this.feedwaterConductivity, 3));
    }
    else {
      this.Nom = Math.exp((4.46 + 0.004 * this.itemp) - Math.exp(-0.02179 * this.itemp - 11.2514) *
        Math.pow(this.feedwaterConductivity, 3));
    }
    // calculation of max
    this.max = (80 - 1.2 * this.feedwaterConductivity);
    if (this.gpmcell < (12.5 / 24.0)) {
      this.silRem = this.Nom;
    }
    else {
      this.silRem =
        ((12.5 / 24) - this.gpmcell)
        * ((this.max - this.Nom) / ((12.5 / 24)
          - (18.75 / 24))) + this.Nom;
    }
    if ((this.gpmcell - 0.25) < 0.01) {
      this.gpmcell = 0.25;
    }
    if (this.feedwaterConductivity > 0) {
      this.saltpasageTest1 = (1 / this.meghaohm / this.feedwaterConductivity);
    }
    else {
      this.saltpasageTest1 = 0;
    }
    if (this.saltpasageTest1 > 1) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = Number(this.saltpasageTest1.toFixed(5));
    }
    let SiO2Out = ((1 - (this.silRem / 100.0)) * (Number(this.feedwaterInput.siO2) * 1000)).toFixed(1);

    let SIO_ouput_sugested;
    if (Number(((1 - (this.silRem / 100.0)) * (Number(this.feedwaterInput.siO2) * 1000)).toFixed(1)) < 5) {
      this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" : "<5";
    }
    else {
      this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" :
        ((1 - (this.silRem / 100.0)) * (Number(this.feedwaterInput.siO2) * 1000)).toFixed(1);;
    }

    let dp_calculation,
      recovery1,
      recovery2,
      max_recovery,
      MX_recov_ouput_sugested


    // D/P calculation


    // if (this.moduleSizeData.flow == "englsih") {
    //   recovery1 = Math.Round((this.flowPerModule) / (((this.flowPerModule)) + 0.02 * (cellsbuffer + 1)) * 100, 2);
    // }
    // else {
    //   dp_calculation = Math.Round(((69.1 * this.gpmcell) - 4.95) - (0.22 * (this.itemp - 5)), 1);
    //   recovery1 = Math.Round((this.flowPerModule) * 4.402868 / (((this.flowPerModule) * 4.402868) + 0.02 * (cellsbuffer + 1)) * 100, 2);
    // }


    dp_calculation = Number((((69.1 * this.gpmcell) - 4.95) - (0.22 * (this.itemp - 5))).toFixed(2));
    if (this.moduleSizeData.pressure == "psi") {
      this.outputSummaryData.DPOuput = dp_calculation;
    }
    else {
      this.outputSummaryData.DPOuput = (dp_calculation * 0.06895).toFixed(2);;
    }

    // calculation of max recovry

    // if ((Number(this.cmnCalc.totalHardnessCaCO3) > 0.2 || Number(this.feedwaterInput.siO2) > 0.5)) {
    //   recovery2 = 90;
    // }
    // else {
    //   recovery2 = 95;
    // }
    // if (recovery1 < recovery2) {
    //   max_recovery = recovery1;
    // }
    // else {
    //   max_recovery = recovery2;
    // }
    // if (recovery1 < recovery2) {
    //   MX_recov_ouput_sugested = recovery1;;
    // }
    // else {
    //   MX_recov_ouput_sugested = recovery2;;
    // }

    let Saltrjectn_ouput_sugested = (100 * (1 - this.saltpasageTest2)).toFixed(1);
    // flow_permodule.Text = Math.Round(this.flowPerModule, 1).ToString();;
    // numberof_permodule_sugested.Text = Number_of_modules.ToString();;

    this.assigningToOutput();
    // total_reject_totalfeed_totalproduct();
  }

  // calculation for VNX current  generation
  VNX28EP() {

    if (this.feedwaterInput.tempUnit == "1") {
      this.itemp = Number(this.feedwaterInput.temp);
    }
    else {
      this.itemp = (Number(this.feedwaterInput.temp) - 32) * 0.55555;
    }

    let flowmoddp = this.flowPerModule * 2;

    // calculation of max recovery and D/P

    let dpressure, Phl, B_out1, Bremov
    if (this.moduleSizeData.flow == "english") {

      let dpressure = ((0.0037 * Math.pow(flowmoddp, 2) + 0.3164 * flowmoddp - 0.0218)).toFixed(2);
      if (this.moduleSizeData.pressure == "psi") {
        this.outputSummaryData.DPOuput = (dpressure);;
      }
      else {
        this.outputSummaryData.DPOuput = (Number(dpressure) * 0.06895).toFixed(2);;
      }


      // Boron calculation
      if (this.flowPerModule > 12.5 && this.flowPerModule
        <= 27.5) {
        Phl = 0.05 + ((this.flowPerModule
          - 12.5) / (27.5 - 12.5)) * (0.1 - 0.05);
        B_out1 = Number(this.feedwaterInput.b) * Phl;
      }
      else if (this.flowPerModule
        > 27.5 && this.flowPerModule
        <= 41.25) {
        Phl = 0.1 + ((this.flowPerModule
          - 55) / (41.25 - 27.5)) * (0.25 - 0.1);
        B_out1 = Number(this.feedwaterInput.b) * Phl;
      }
      else {
        B_out1 = 0.0;
      }
    }
    else {
      dpressure = Number(((0.0049 * Math.pow(flowmoddp, 2) + 0.096 * flowmoddp - 0.0015)).toFixed(2));
      if (this.moduleSizeData.pressure == "psi") {
        this.outputSummaryData.DPOuput = (dpressure * 14.5038).toFixed(2);;
      }
      else {
        this.outputSummaryData.DPOuput = dpressure;
      }
      // Boron calculation
      if (this.flowPerModule
        > 2.8 && this.flowPerModule
        <= 6.2) {
        Phl = 0.05 + ((this.flowPerModule
          - 12.5) / (27.5 - 12.5)) * (0.1 - 0.05);
        B_out1 = Number(this.feedwaterInput.b) * Phl;
      }
      else if (this.flowPerModule
        > 6.2 && this.flowPerModule
        <= 9.4) {
        Phl = 0.1 + ((this.flowPerModule
          - 55) / (41.25 - 27.5)) * (0.25 - 0.1);
        B_out1 = Number(this.feedwaterInput.b) * Phl;
      }
      else {
        B_out1 = 0.0;
      }
    }

    let fInterp = (this.flowPerModule
      - 27.5) / (36.75 - 27.55);



    // IList < module_sizesystem > allmodulesize = build_module_sizesystem();
    // var MinNominalandMaxFlow = (from s in allmodulesize
    //                             where s.id.Equals(IpInput.ModuleSize)
    //                             select new
    //   {
    //     minflow = flow_selected == "1" ? s.min_flow : s.min_flow_m3h,
    //     nominalflow = flow_selected == "1" ? s.nominal_flow : s.nominal_flow_m3h,
    //     maxflow = flow_selected == "1" ? s.max_flow : s.max_flow_m3h,
    //   }).First();
    let minFlow = this.moduleSizeData.flow == 'english' ? this.moduleSizeRecord.minFlow :
      this.moduleSizeRecord.minFlowm3h;
    let maxFlow = this.moduleSizeData.flow == 'english' ? this.moduleSizeRecord.maxFlow :
      this.moduleSizeRecord.maxFlowm3h;
    let nominalFlow = this.moduleSizeData.flow == 'english' ? this.moduleSizeRecord.nominalFlowgpm :
      this.moduleSizeRecord.nominalFlowm3h;

    this.meghaohm = this.genrelService.megaOhmCalculationForVnx(
      this.flowPerModule,
      minFlow,
      maxFlow,
      nominalFlow,
      this.feedwaterConductivity);

    // var silicaCalc = silicalc.silicaCalculationForVNX(this.flowPerModule, Convert.ToDouble(MinNominalandMaxFlow.minflow), Convert.ToDouble(MinNominalandMaxFlow.nominalflow), Convert.ToDouble(MinNominalandMaxFlow.maxflow), this.feedwaterConductivity);


    // to convert ppm to ppb mutply sio2 to 1000


    // var siloutfinal = Number(((Number(this.feedwaterInput.siO2) * 1000) * (1 - (silicaCalc / 100))).toFixed(2));



    // if (Number(this.feedwaterInput.siO2) >= 0.5) {
    //   this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" : "NA";
    // }
    // else {
    //   this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" : siloutfinal;
    // }


    if (this.feedwaterConductivity > 0) {
      this.saltpasageTest1 = 1 / this.meghaohm / this.feedwaterConductivity;
    }
    else {
      this.saltpasageTest1 = 0;
    }

    if (this.moduleSizeData.flow == "english") {
      if (this.flowPerModule
        <= 27.5) {
        Bremov = 95;
      }
      else {
        Bremov = (fInterp * -3) + 95;
      }
    }
    else {
      if (this.flowPerModule
        <= 27.5) {
        Bremov = 95;
      }
      else {
        Bremov = (fInterp * -3) + 95;
      }
    }
    if (this.saltpasageTest1 > 1) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = this.saltpasageTest1;
    }
    if (this.saltpasageTest2 > 0.005) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = this.saltpasageTest1;
    }

    let saltpasage = ((1 - this.saltpasageTest2) * 100).toFixed(2);
    // calculation of B
    if (Number(this.feedwaterInput.b) > 150) {
      this.outputSummaryData.BOuput = "NA";
    }
    else if (Number(this.feedwaterInput.b) > 0.05 && B_out1 < 0.05) {
      B_out1 = 0.05;
    }
    else {
      this.outputSummaryData.BOuput = Number(this.feedwaterInput.b) == 0 ? "" : B_out1.toFixed(3);
    }
    this.assigningToOutput();

    // Max_recovery_out.Text = maxRecoveryCalc.maxRecovery(Hardness,     Number(this.feedwaterInput.siO2)).ToString();
    // MX_recov_ouput_sugested1.Text = maxRecoveryCalc.maxRecovery(Hardness,     Number(this.feedwaterInput.siO2)).ToString();
    // MX_recov_ouput_sugested2.Text = maxRecoveryCalc.maxRecovery(Hardness,     Number(this.feedwaterInput.siO2)).ToString();
    // Saltrjectn_ouput_sugested.Text = Math.Round(saltpasage, 1).ToString();;


    //total_reject_totalfeed_totalproduct();
  }

  VNX55EP() {

    let flowpercell = 0.0;
    if (this.feedwaterInput.tempUnit == "1") {
      this.itemp = Number(this.feedwaterInput.temp);
    }
    else {
      this.itemp = (Number(this.feedwaterInput.temp) - 32) * 0.55555;
    }

    let dpressure, Phl, B_out1, Bremov, max_recovery
    // calculation of max recovery and D/P
    if (this.moduleSizeData.flow == "english") {
      let cond1 = this.flowPerModule * (1 - (this.maxRecov2 / 100));
      let checkvalue = ((50.0 / 55.0) * 1.98);
      if (cond1 < checkvalue) {
        max_recovery =
          Number(((this.flowPerModule) / (this.flowPerModule + ((50.0 / 55.0) * 1.98)) * 100.0)).toFixed(2);
      }
      else {
        max_recovery = this.maxRecov2;
      }


      //claculate dp 
      if (this.moduleSizeData.moduleSize == "39") {
        //for vnx max dp
        if (this.moduleSizeData.pressure == "psi") {
          this.outputSummaryData.DPOuput =
            Number((0.0031 * Math.pow(this.flowPerModule, 2)) + (0.2777 * this.flowPerModule) - 0.4492).toFixed(2);
        }
        else {
          this.outputSummaryData.DPOuput =
            Number(((0.0031 * Math.pow(this.flowPerModule, 2)) + (0.2777 * this.flowPerModule) - 0.4492) / 14.5).toFixed(2);
        }
      }


      else if (this.moduleSizeData.moduleSize == "40") {

        //for vnx min dp
        if (this.moduleSizeData.pressure == "psi") {

          this.outputSummaryData.DPOuput =
            Number((0.0049 * Math.pow(this.flowPerModule, 2)) + (0.3459 * this.flowPerModule) - 0.4434).toFixed(2);
        }
        else {

          this.outputSummaryData.DPOuput =
            Number(((0.0049 * Math.pow(this.flowPerModule, 2)) + (0.3459 * this.flowPerModule) - 0.4434) / 14.5).toFixed(2);;
        }

      }
      else {
        let dpressure =
          Number((0.0037 * Math.pow(this.flowPerModule, 2) + 0.3164 * this.flowPerModule - 0.0218)).toFixed(5);
        if (this.moduleSizeData.pressure == "psi") {
          this.outputSummaryData.DPOuput = Number(dpressure).toFixed(2);
        }
        else {
          this.outputSummaryData.DPOuput = (Number(dpressure) * 0.06895).toFixed(2);
        }
      }

    }
    else {
      if ((this.flowPerModule * (1 - (this.maxRecov2 / 100))) < ((50 / 55) * 0.4497069)) {
        max_recovery =
          Number(((this.flowPerModule) / (this.flowPerModule + ((50 / 55) * 0.4497069)) * 100)).toFixed(2);
      }
      else {
        max_recovery = this.maxRecov2;

      }
      //pressure calculated in bar
      //claculate dp 
      if (this.moduleSizeData.moduleSize == "39") {
        //for vnx max dp
        if (this.moduleSizeData.pressure == "psi") {
          this.outputSummaryData.DPOuput =
            Number(((0.0042 * Math.pow(this.flowPerModule, 2)) + (0.0843 * this.flowPerModule) - 0.031) * 14.5).toFixed(2);;
        }
        else {
          this.outputSummaryData.DPOuput = Number(((0.0042 * Math.pow(this.flowPerModule, 2)) + (0.0843 * this.flowPerModule) - 0.031)).toFixed(2);;
        }
      }
      else if (this.moduleSizeData.moduleSize == "40") {
        //for vnx min dp

        if (this.moduleSizeData.pressure == "psi") {
          this.outputSummaryData.DPOuput =
            Number(((0.0065 * Math.pow(this.flowPerModule, 2)) + (0.1049 * this.flowPerModule) - 0.0306) * 14.5).toFixed(2);;
        }
        else {
          this.outputSummaryData.DPOuput =
            Number(((0.0065 * Math.pow(this.flowPerModule, 2)) + (0.1049 * this.flowPerModule) - 0.0306)).toFixed(2);
        }
      }
      else {

        let dpressure =
          Number((0.0049 * Math.pow(this.flowPerModule, 2) + 0.096 * this.flowPerModule - 0.0015)).toFixed(3);
        if (this.moduleSizeData.pressure == "psi") {
          this.outputSummaryData.DPOuput =
            (Number(dpressure) * 14.5038).toFixed(3);;
        }
        else {
          this.outputSummaryData.DPOuput =
            (Number(dpressure)).toFixed(2);;
        }
      }
    }


    //silicon calculation changed as per redmin ticket 21377
    // IList < module_sizesystem > allmodulesize = build_module_sizesystem();
    // var MinNominalandMaxFlow = (from s in allmodulesize
    //                                     where s.id.Equals(IpInput.ModuleSize)
    //                                     select new
    //   {
    //     minflow = flow_selected == "1" ? s.min_flow : s.min_flow_m3h,
    //     nominalflow = flow_selected == "1" ? s.nominal_flow : s.nominal_flow_m3h,
    //     maxflow = flow_selected == "1" ? s.max_flow : s.max_flow_m3h,
    //   }).First();



    let fInterp = (this.flowPerModule - 55) / (73.5 - 55);



    if (this.moduleSizeData.flow == "english") {
      if (this.flowPerModule <= 55) {
        Bremov = 95;
      }
      else {
        Bremov = (fInterp * -3) + 95;
      }
    }
    else {
      if (this.flowPerModule <= 55) {
        Bremov = 95;
      }
      else {
        Bremov = (fInterp * -3) + 95;
      }
    }

    //boronCalc calculation for VNXMax,VNX15CDIT MINI,VNX55EP
    //for VNX Max



    //calculatopn for Sio2out 
    //Calculation changed as per redmine ticket 21377
    //   var siloutfinal = silicalc.CalCulateSilicaVnxModule(flow_selected,     Number(this.feedwaterInput.siO2), (this.flowPerModule), this.feedwaterConductivity, Convert.ToDouble(MinNominalandMaxFlow.minflow), Convert.ToDouble(MinNominalandMaxFlow.maxflow), Convert.ToDouble(MinNominalandMaxFlow.nominalflow));

    // this.meghaohm = megaOhmCalc.megaOhmCalculationForVnx(this.flowPerModule, Convert.ToDouble(MinNominalandMaxFlow.minflow), Convert.ToDouble(MinNominalandMaxFlow.nominalflow), Convert.ToDouble(MinNominalandMaxFlow.maxflow), this.feedwaterConductivity);
    // let silicaCalc = silicalc.silicaCalculationForVNX(this.flowPerModule, Convert.ToDouble(MinNominalandMaxFlow.minflow), Convert.ToDouble(MinNominalandMaxFlow.nominalflow), Convert.ToDouble(MinNominalandMaxFlow.maxflow), this.feedwaterConductivity);



    //handle this later


    // to convert ppm to ppb mutply sio2 to 1000
    // var siloutfinal = Math.Round((Number(this.feedwaterInput.siO2) * 1000) * (1 - (silicaCalc / 100)), 3);
    //calculatopn for Sio2out 

    // if (Number(this.feedwaterInput.siO2) >= 0.5) {
    //   this.outputSummaryData.SIO2Ouput = "NA";
    // }
    // else {
    //   this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" : siloutfinal.ToString();
    // }
    this.feedwaterConductivity

    if (this.feedwaterConductivity > 0) {
      this.saltpasageTest1 = 1 / this.meghaohm / this.feedwaterConductivity;
    }
    else {
      this.saltpasageTest1 = 0;
    }
    if (this.saltpasageTest1 > 1) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = this.saltpasageTest1;
    }
    if (this.saltpasageTest2 > 0.005) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = this.saltpasageTest1;
    }


    let saltpasage =
      ((1 - this.saltpasageTest2) * 100).toFixed(2);

    //modified as per #29853

    if (this.moduleSizeData.moduleSize == "39") {
      flowpercell = (this.flowPerModule / 120) * 100;
    }
    else if (this.moduleSizeData.moduleSize == "40") {
      flowpercell = (this.flowPerModule / 96) * 100;
    }
    else {
      flowpercell = this.flowPerModule;
    }

    //    this.outputSummaryData.BOuput =   Number(this.feedwaterInput.b)== 0 ? "" : (  Number(this.feedwaterInput.b)> 150 ? "NA" :
    //   boronCalc.calculateBoronMaxMiniVNX55EP(flowpercell, B, flow_selected).ToString());;
    // Totalproductivity_ouput_sugested.Text = (product_flowrate).ToString();;
    // Saltrjectn_ouput_sugested.Text = Math.Round(saltpasage, 1).ToString();;
    // numberof_permodule_sugested.Text = Number_of_modules.ToString();;
    // if (this.moduleSizeData.moduleSize != "39" && this.moduleSizeData.moduleSize != "40") {
    //   flow_permodule.Text = Math.Round(this.flowPerModule, 2).ToString();
    // }

    // MX_recov_ouput_sugested.Text = maxRecoveryCalc.maxRecovery(Hardness,     Number(this.feedwaterInput.siO2)).ToString();
    this.assigningToOutput();

  }


  VNX55EX() {

    this.maxRecov1 = 97.5;
    let fInterp = (this.flowPerModule - 55.55) / (73.5 - 55.55);
    let Nom = 99, max = 96, Bnom = 99, Bmax = 96;

    let NaNom,
      NaMax,
      NaRemove,
      ClNom,
      Clmax,
      Clremove, Phl,
      Low_Silica_Passage = 0.01,
      High_Silica_Passage = 0,
      High_Silica_Passage_Out = 0;


    if (this.feedwaterInput.tempUnit == "1") {
      this.itemp = Number(this.feedwaterInput.temp);
    }
    else {
      this.itemp = (Number(this.feedwaterInput.temp) - 32) * 0.55555;
    }


    if (this.moduleSizeData.flow == "english") {

      if (this.moduleSizeData.pressure == "psi") {
        this.outputSummaryData.DPOuput = ((this.flowPerModule * 0.9375) - 11.875).toFixed(1);;
      }
      else {
        this.outputSummaryData.DPOuput = (((this.flowPerModule * 0.9375) - 11.875) * 0.06895).toFixed(2);;
      }
    }
    else {
      if (this.moduleSizeData.pressure == "psi") {
        this.outputSummaryData.DPOuput = ((((this.flowPerModule * 4.402868) * 0.9375) - 11.875)).toFixed(1);;
      }
      else {
        this.outputSummaryData.DPOuput = ((((this.flowPerModule * 4.402868) * 0.9375) - 11.875) * 0.06895).toFixed(1);
      }


    }
    this.feedwaterConductivity

    if (this.feedwaterConductivity <= 1) {
      this.meghaohm = 18;
    }
    else if (this.feedwaterConductivity <= 10) {
      this.meghaohm = 17.5;
    }
    let silRem, rlnterp, Bremov

    if (this.flowPerModule <= 55) {
      silRem = Nom;
    }
    else {
      silRem = (fInterp * -3) + Nom;
    }
    rlnterp = ((this.maxRecov1 - 97) / 2);
    if (this.flowPerModule <= 55) {
      Bremov = Bnom;
    }
    else {
      Bremov = (fInterp * -3) + Bnom;
    }
    if (this.feedwaterConductivity < 1) {
      NaNom = 99.8;
    }
    else {
      NaNom = 99.99;
    }
    if (this.feedwaterConductivity < 1) {
      NaMax = 99.9;
    }
    else {
      NaMax = 99.99;
    }
    if (this.feedwaterConductivity <= 73.5) {
      NaRemove = (fInterp * (NaMax - NaNom)) + NaNom;
    }
    NaRemove = 99.9;

    if (this.feedwaterConductivity < 1) {
      ClNom = 99.94;
    }
    else {
      ClNom = 99.99;
    }
    if (this.feedwaterConductivity < 1) {
      Clmax = 99.99;
    }
    else {
      Clmax = 99.99;
    }
    if (this.flowPerModule <= 55.55) {
      Clremove = ClNom;
    }
    else if (this.flowPerModule <= 73.5) {
      Clremove = fInterp * (Clmax - ClNom) + ClNom;
    }
    Clremove = 99.9;
    if (this.feedwaterConductivity > 0) {
      this.saltpasageTest1 = (1 / this.meghaohm / this.feedwaterConductivity);
    }
    else {
      this.saltpasageTest1 = 0;
    }
    if (this.saltpasageTest1 > 1) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = this.saltpasageTest1;
    }
    this.saltpasageTest2 = 0.001;
    //changed as per redmine bug refrence no. 	21377	

    let PH = 0.01 + ((this.flowPerModule - 55) / (73.5 - 55)) * (0.04 - 0.01);
    //    Number(this.feedwaterInput.siO2)Out = silicalc.CalculateSilicaVnx(this.flowPerModule,    Number(this.feedwaterInput.siO2),flow_selected,0.01,PH);
    if (Number(this.feedwaterInput.siO2) >= 0.5) {
      this.outputSummaryData.SiO2Out = "NA";
    }
    else {
      // this.outputSummaryData.SiO2Out = Number(this.feedwaterInput.siO2) == 0 ? "" :
      //   silicalc.CalculateSilicaVnx(this.flowPerModule, Number(this.feedwaterInput.siO2), flow_selected, 0.01, "VNX55EX").ToString();
    }

    //Boron calculation as per new redmine ticket reffrence no. Bug #24142
    if (Number(this.feedwaterInput.b) > 150) {
      this.outputSummaryData.BOuput = "NA";
    }
    else {
      // this.outputSummaryData.BOuput =
      //   Number(this.feedwaterInput.b) == 0 ? "" :
      //     boronCalc.calculateBoron(this.flowPerModule, Number(this.feedwaterInput.b), flow_selected, 0.01, "VNX55EX").ToString();
    }

    // MX_recov_ouput_sugested.Text = maxRecoveryCalc.maxRecoveryVNX55EX2(Hardness,     Number(this.feedwaterInput.siO2)).ToString();;
    // saltpasage = Math.Round((1 -  this.saltpasageTest2) * 100, 2);

    // under confusion in excel sheet direct value 0.001

    // Salt_rejection.Text = saltpasage.ToString();;

    // Saltrjectn_ouput_sugested.Text = Math.Round(saltpasage, 2).ToString();;
    // flow_permodule.Text = Math.Round(this.flowPerModule, 2).ToString();;
    // numberof_permodule_sugested.Text = Number_of_modules.ToString();;

    // Resistvity_ouput_sugested.Text = Math.Round(this.meghaohm, 1).ToString();;
    //   double multplicationfactor = Math.Round(1 - (NaRemove / 100), 4);
    // NH4_ouput_sugestedsd.Text = Math.Round(NH4 * multplicationfactor, 6).ToString().IslesserThanValue();
    // K_ouput_sugested.Text = Math.Round(K * multplicationfactor, 6).ToString().IslesserThanValue();
    // Na_ouput_sugested.Text = Math.Round(Na * multplicationfactor, 6).ToString().IslesserThanValue();
    // Mg_ouput_sugested.Text = Math.Round(Mg * multplicationfactor, 6).ToString().IslesserThanValue();
    // Ca_ouput_sugested.Text = Math.Round(Ca * multplicationfactor, 6).ToString().IslesserThanValue();
    // Sr_ouput_sugested.Text = Math.Round(Sr * multplicationfactor, 6).ToString().IslesserThanValue();
    // Ba_ouput_sugested.Text = Math.Round(Ba * multplicationfactor, 6).ToString().IslesserThanValue();
    // Fe_ouput_sugested.Text = Math.Round(Fe * multplicationfactor, 6).ToString().IslesserThanValue();
    // Cu_ouput_sugested.Text = Math.Round(Cu * multplicationfactor, 6).ToString().IslesserThanValue();
    // Al_ouput_sugested.Text = Math.Round(Al * multplicationfactor, 6).ToString().IslesserThanValue();
    // Mn_ouput_sugested.Text = Math.Round(Mn * multplicationfactor, 6).ToString().IslesserThanValue();
    // CO_ouput_sugested.Text = Math.Round(CO3 * multplicationfactor, 6).ToString().IslesserThanValue();
    // HCO_ouput_sugested.Text = Math.Round(HCO3 * multplicationfactor, 6).ToString().IslesserThanValue();
    // NO_ouput_sugested.Text = Math.Round(NO3 * multplicationfactor, 6).ToString().IslesserThanValue();
    // Cl_ouput_sugested.Text = Math.Round(Cl * multplicationfactor, 6).ToString().IslesserThanValue();
    // F_ouput_sugested.Text = Math.Round(F * multplicationfactor, 6).ToString().IslesserThanValue();
    // SO_ouput_sugested.Text = Math.Round(SO4 * multplicationfactor, 6).ToString().IslesserThanValue();
    // CO2_ouput_sugested.Text = Math.Round(CO2 * multplicationfactor, 6).ToString().IslesserThanValue();
    // Totalproductivity_ouput_sugested.Text = product_flowrate.ToString();;
    // total_reject_totalfeed_totalproduct();
  }
  VNX55HH() {

    let netproductflow, Todilflow, Temp_factor, flowfactor;
    if (this.moduleSizeData.flow == "english") {
      netproductflow = this.flowPerModule;
    }
    else {
      netproductflow = 0;
    }

    if (this.feedwaterInput.tempUnit == "1") {
      this.itemp = Number(this.feedwaterInput.temp);
    }
    else {
      this.itemp = (Number(this.feedwaterInput.temp) - 32) * 0.55555;
    }

    Todilflow = (netproductflow / this.maxRecov1) * 100;

    if (this.moduleSizeData.flow == "english") {

      let dpressure = ((0.0037 * Math.pow(Number(this.moduleSizeData.productFlowRate), 2)
        + 0.3164 * Number(this.moduleSizeData.productFlowRate) - 0.0218)).toFixed(1);
      if (this.moduleSizeData.pressure == "psi") {
        this.outputSummaryData.DPOuput = dpressure;
      }
      else {
        this.outputSummaryData.DPOuput = (Number(dpressure) * 0.06895).toFixed(2);
      }
    }
    else {

      let dpressure = ((0.0037 * Math.pow(Number(this.moduleSizeData.productFlowRate), 2) + 0.3164 * Number(this.moduleSizeData.productFlowRate) - 0.0218)).toFixed(1);
      if (this.moduleSizeData.pressure == "psi") {
        this.outputSummaryData.DPOuput = (dpressure);;
      }
      else {
        this.outputSummaryData.DPOuput = (Number(dpressure) * 0.06895).toFixed(2);;
      }
    }
    let min, Nom, max
    // calculation of min
    if (this.feedwaterConductivity <= 15) {
      min = 17 - this.feedwaterConductivity / 15;
    }
    else if (this.feedwaterConductivity <= 30 && this.feedwaterConductivity > 15) {
      min = 24 - 16 * this.feedwaterConductivity / 30;
    }
    else {
      min = 14 - 0.2 * this.feedwaterConductivity;
    }
    // calculation of nom
    if (this.feedwaterConductivity <= 15) {
      Nom = 17 - this.feedwaterConductivity / 15;
    }
    else if (this.feedwaterConductivity <= 30 && this.feedwaterConductivity > 15) {
      Nom = 24 - 16 * this.feedwaterConductivity / 30;
    }
    else {
      Nom = 14 - 0.2 * this.feedwaterConductivity;
    }
    if (this.feedwaterConductivity <= 20) {
      max = 17 - 0.75 * this.feedwaterConductivity;
    }
    else {
      max = 3 - 0.05 * this.feedwaterConductivity;
    }
    if (Number(this.cmnCalc.totalHardnessCaCO3) < 1) {
      if (this.moduleSizeData.flow == "english") {
        if (this.flowPerModule == 22.5) {
          this.meghaohm = min;
        }
        else if (this.flowPerModule < 49.5) {
          this.meghaohm = (this.flowPerModule - 22.5) / 22.5 * (Nom - min) + min;
        }
        else if (this.flowPerModule == 49.5) {
          this.meghaohm = Nom;
        }
        else if (this.flowPerModule < 62.1) {
          this.meghaohm = (this.flowPerModule - 49.5) / 49.5 * (max - Nom) + Nom;
        }
        else {
          this.meghaohm = max;
        }
      }
      else {

        if ((this.flowPerModule * 4.402868) == 22.5) {
          this.meghaohm = min;

        }
        else if ((this.flowPerModule * 4.402868) < 49.5) {
          this.meghaohm = (this.flowPerModule * 4.402868 - 22.5) / 22.5 * (Nom - min) + min;
        }
        else if ((this.flowPerModule * 4.402868) == 49.5) {
          this.meghaohm = Nom;
        }
        else if ((this.flowPerModule * 4.402868) < 62.1) {
          this.meghaohm = (this.flowPerModule * 4.402868 - 49.5) / 49.5 * (max - Nom) + Nom;
        }
        else {
          this.meghaohm = max;
        }
      }
    }
    //if hardness is greater  than one 
    else if (Number(this.cmnCalc.totalHardnessCaCO3) > 1 && Number(this.cmnCalc.totalHardnessCaCO3) < 2) {
      if (this.moduleSizeData.flow == "english") {
        if (this.flowPerModule == 20) {
          this.meghaohm = min;
        }
        else if (this.flowPerModule < 44) {
          this.meghaohm = (this.flowPerModule - 20) / 20 * (Nom - min) + min;
        }

        else if (this.flowPerModule == 44) {
          this.meghaohm = Nom;
        }
        else if (this.flowPerModule < 55.2) {
          this.meghaohm = (this.flowPerModule - 55.2) / 55.2 * (max - Nom) + Nom;
        }
        else {
          this.meghaohm = max;
        }
      }// for metric
      else {
        if ((this.flowPerModule * 4.402868) == 20) {
          this.meghaohm = min;
        }
        else if ((this.flowPerModule * 4.402868) < 44) {
          this.meghaohm = (this.flowPerModule * 4.402868 - 20) / 20 * (Nom - min) + min;
        }
        else if ((this.flowPerModule * 4.402868) == 44) {
          this.meghaohm = Nom;
        }
        else if ((this.flowPerModule * 4.402868) < 55.2) {
          this.meghaohm = (this.flowPerModule * 4.402868 - 55.2) / 55.2 * (max - Nom) + Nom;
        }
        else {
          this.meghaohm = max;
        }
      }
    }

    min = 97 - 0.05 * this.feedwaterConductivity;
    Nom = min;
    if (this.feedwaterConductivity < 10) {
      max = 95;
    }
    else {
      max = 100 - 0.5 * this.feedwaterConductivity;
    }
    if (this.itemp > 20) {
      Temp_factor = 1;
    }
    else {
      Temp_factor = (this.itemp - 5) / (15);
    }
    if (this.flowPerModule > 62.5) {
      flowfactor = 0;
    }
    else if (this.flowPerModule < 50) {
      flowfactor = 1;
    }
    else {
      flowfactor = 1 - ((this.flowPerModule - 50) / (12.5));
    }

    let silremlow, SilRemMax, silRem, sio_calculation

    if (this.feedwaterConductivity <= 20) {
      silremlow = (6 * Temp_factor) + ((-0.1 * this.feedwaterConductivity) + 92);
      SilRemMax = (6 * Temp_factor) + ((-0.2 * this.feedwaterConductivity) + 92);
    }
    else {
      silremlow = (6 * Temp_factor) + ((-0.2 * this.feedwaterConductivity) + 94);
      SilRemMax = (6 * Temp_factor) + ((-0.7 * this.feedwaterConductivity) + 102);
    }
    silRem = (silremlow - SilRemMax) * flowfactor + SilRemMax;

    if (this.feedwaterConductivity > 0) {
      this.saltpasageTest1 = (1 / this.meghaohm / this.feedwaterConductivity);
    }
    else {
      this.saltpasageTest1 = 0;
    }

    if (this.saltpasageTest1 > 1) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = this.saltpasageTest1;
    }

    let saltpasage = ((1 - this.saltpasageTest2) * 100).toFixed(2);
    //calculatopn for Sio2out 
    if (Number(this.feedwaterInput.siO2) <= 0.5) {
      sio_calculation = (((1 - (silRem / 100)) * (Number(this.feedwaterInput.siO2) * 1000)).toFixed(1));
    }
    if (Number(sio_calculation) < 5) {
      this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" : "<5";
    }
    else {
      this.outputSummaryData.SIO2Ouput = "NA";
    }
    // MX_recov_ouput_sugested.Text = maxRecoveryCalc.maxRecoveryVNX55HH2(Hardness,     Number(this.feedwaterInput.siO2)).ToString();
    // Saltrjectn_ouput_sugested.Text = Math.Round(saltpasage, 1).ToString();
    // flow_permodule.Text = Math.Round(this.flowPerModule , 1).ToString();
    // numberof_permodule_sugested.Text = Number_of_modules.ToString();

    // Resistvity_ouput_sugested.Text = Math.Round(meghaohm, 1).ToString();;
    // NH4_ouput_sugestedsd.Text = Math.Round(NH4 * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // K_ouput_sugested.Text = Math.Round(K * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Na_ouput_sugested.Text = Math.Round(Na * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Mg_ouput_sugested.Text = Math.Round(Mg * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Ca_ouput_sugested.Text = Math.Round(Ca * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Sr_ouput_sugested.Text = Math.Round(Sr * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Ba_ouput_sugested.Text = Math.Round(Ba * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Fe_ouput_sugested.Text = Math.Round(Fe * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Cu_ouput_sugested.Text = Math.Round(Cu * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Al_ouput_sugested.Text = Math.Round(Al * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Mn_ouput_sugested.Text = Math.Round(Mn * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // CO_ouput_sugested.Text = Math.Round(CO3 * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // HCO_ouput_sugested.Text = Math.Round(HCO3 * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // NO_ouput_sugested.Text = Math.Round(NO3 * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Cl_ouput_sugested.Text = Math.Round(Cl * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // F_ouput_sugested.Text = Math.Round(F * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // SO_ouput_sugested.Text = Math.Round(SO4 * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // CO2_ouput_sugested.Text = Math.Round(CO2 * this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Totalproductivity_ouput_sugested.Text = product_flowrate.ToString();;
    // total_reject_totalfeed_totalproduct();
    this.assigningToOutput();
  }

  VNX30CDIT() {

    let opt2Amp, opt4Amp, Modamp, opt6Amp, currentStack;
    if (this.feedwaterInput.tempUnit == "1") {
      this.itemp = Number(this.feedwaterInput.temp);
    }
    else {
      this.itemp = (Number(this.feedwaterInput.temp) - 32) * 0.55555;
    }


    if ((Number(this.cmnCalc.totalHardnessCaCO3) >= 0.0 && Number(this.cmnCalc.totalHardnessCaCO3) <= 1.0) && (Number(this.feedwaterInput.siO2) >= 0.0 && Number(this.feedwaterInput.siO2) <= 1.0)) {

      opt2Amp = true;
      Modamp = 12;
      currentStack = "6";
    }
    else if ((Number(this.cmnCalc.totalHardnessCaCO3) > 1.0 && Number(this.cmnCalc.totalHardnessCaCO3) <= 2.5) || (Number(this.feedwaterInput.siO2) > 1.0 && Number(this.feedwaterInput.siO2) <= 1.5)) {
      opt4Amp = true;
      Modamp = 8;
      currentStack = "4";
    }
    else if ((Number(this.cmnCalc.totalHardnessCaCO3) > 2.5 && Number(this.cmnCalc.totalHardnessCaCO3) <= 4.0) || (Number(this.feedwaterInput.siO2) > 1.5 && Number(this.feedwaterInput.siO2) <= 2.0)) {
      opt6Amp = true;
      Modamp = 4;
      currentStack = "2";
    }


    // IList < module_sizesystem > allmodulesize = build_module_sizesystem();
    // var MinNominalandMaxFlow = (from s in allmodulesize
    //                                     where s.id.Equals(IpInput.ModuleSize)
    //                                     select new
    //   {
    //     minflow = flow_selected == "1" ? s.min_flow : s.min_flow_m3h,
    //     nominalflow = flow_selected == "1" ? s.nominal_flow : s.nominal_flow_m3h,
    //     maxflow = flow_selected == "1" ? s.max_flow : s.max_flow_m3h,
    //   }).First();



    //megaOhm calculation for restivity

    // this.meghaohm = megaOhmCalc.NewMeghaOhmCalculationCDIT(flow_per_modules, Convert.ToDouble(MinNominalandMaxFlow.minflow), Convert.ToDouble(MinNominalandMaxFlow.nominalflow), Convert.ToDouble(MinNominalandMaxFlow.maxflow), this.feedwaterConductivity, currentStack);
    // var silicaCalc = silicalc.newSilicaCalculationForCDIT(flow_per_modules, Convert.ToDouble(MinNominalandMaxFlow.minflow), Convert.ToDouble(MinNominalandMaxFlow.nominalflow), Convert.ToDouble(MinNominalandMaxFlow.maxflow), this.feedwaterConductivity, currentStack);



    // to convert ppm to ppb mutply sio2 to 1000

    // var siloutfinal = (Number(this.feedwaterInput.siO2) * 1000) * (1 - (silicaCalc / 100));

    // if (Number(this.feedwaterInput.siO2) >= 2.0) {
    //   this.outputSummaryData.SIO2Ouput = "NA";
    // }
    // else {
    //   this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" :
    //     (siloutfinal).toFixed(3);;
    // }

    if (this.feedwaterConductivity > 0) {
      this.saltpasageTest1 = (1 / this.meghaohm / this.feedwaterConductivity);
    }
    else {
      this.saltpasageTest1 = 0;
    }
    if (this.saltpasageTest1 > 1) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = this.saltpasageTest1;
    }
    //0.0106x2 + 0.5028x
    //  this.outputSummaryData.DPOuput = Math.Round((0.0106 * Math.Pow(flow_per_modules, 2) + 0.5028 * flow_per_modules), 2).ToString();;
    // MX_recov_ouput_sugested.Text = maxRecoveryCalc.maxRecoveryVNX15and30CDIT(Number(this.cmnCalc.totalHardnessCaCO3),     Number(this.feedwaterInput.siO2)).ToString();
    // saltpasage = Math.Round((1 -  this.saltpasageTest2) * 100, 2);
    // //  saltpasage = Math.Round(100 * (1 -  this.saltpasageTest2), 2);
    // Saltrjectn_ouput_sugested.Text = Math.Round(saltpasage, 1).ToString();
    // flow_permodule.Text = Math.Round(FlowMod, 1).ToString();;
    // numberof_permodule_sugested.Text = Number_of_modules.ToString();

    // Resistvity_ouput_sugested.Text = Math.Round(this.meghaohm, 2).ToString();;
    // NH4_ouput_sugestedsd.Text = Math.Round(NH4 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // K_ouput_sugested.Text = Math.Round(K *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Na_ouput_sugested.Text = Math.Round(Na *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Mg_ouput_sugested.Text = Math.Round(Mg *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Ca_ouput_sugested.Text = Math.Round(Ca *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Sr_ouput_sugested.Text = Math.Round(Sr *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Ba_ouput_sugested.Text = Math.Round(Ba *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Fe_ouput_sugested.Text = Math.Round(Fe *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Cu_ouput_sugested.Text = Math.Round(Cu *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Al_ouput_sugested.Text = Math.Round(Al *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Mn_ouput_sugested.Text = Math.Round(Mn *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // CO_ouput_sugested.Text = Math.Round(CO3 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // HCO_ouput_sugested.Text = Math.Round(HCO3 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // NO_ouput_sugested.Text = Math.Round(NO3 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Cl_ouput_sugested.Text = Math.Round(Cl *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // F_ouput_sugested.Text = Math.Round(F *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // SO_ouput_sugested.Text = Math.Round(SO4 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // CO2_ouput_sugested.Text = Math.Round(CO2 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Totalproductivity_ouput_sugested.Text = product_flowrate.ToString();;
    // total_reject_totalfeed_totalproduct();
    this.assigningToOutput();
  }

  VNX15CDIT() {
    // FlowMod = FlowMod * 2;
    let FlowMod = this.flowPerModule * 2;
    let opt2Amp, opt4Amp, Modamp, opt6Amp, currentStack;

    if (this.feedwaterInput.tempUnit == "1") {
      this.itemp = Number(this.feedwaterInput.temp);
    }
    else {
      this.itemp = (Number(this.feedwaterInput.temp) - 32) * 0.55555;
    }

    if ((Number(this.cmnCalc.totalHardnessCaCO3) >= 0.0 && Number(this.cmnCalc.totalHardnessCaCO3) <= 1.0) && (Number(this.feedwaterInput.siO2) >= 0.0 && Number(this.feedwaterInput.siO2) <= 1.0)) {
      opt2Amp = true;
      Modamp = 6;
      currentStack = "6";
    }
    else if ((Number(this.cmnCalc.totalHardnessCaCO3) > 1.0 && Number(this.cmnCalc.totalHardnessCaCO3) <= 2.5) || (Number(this.feedwaterInput.siO2) > 1.0 && Number(this.feedwaterInput.siO2) <= 1.5)) {
      //max_recovery = 85;
      opt4Amp = true;
      Modamp = 4;
      currentStack = "4";
    }
    else if ((Number(this.cmnCalc.totalHardnessCaCO3) > 2.5 && Number(this.cmnCalc.totalHardnessCaCO3) <= 4.0) || (Number(this.feedwaterInput.siO2) > 1.5 && Number(this.feedwaterInput.siO2) <= 2.0)) {
      //max_recovery = 80;
      opt6Amp = true;
      Modamp = 2;
      currentStack = "2";
    }
    // IList < module_sizesystem > allmodulesize=  build_module_sizesystem();
    // var MinNominalandMaxFlow = (from s in allmodulesize where s.id.Equals(IpInput.ModuleSize)
    //                                     select new
    //   {
    //     minflow=flow_selected == "1" ? s.min_flow : s.min_flow_m3h,
    //     nominalflow= flow_selected == "1" ? s.nominal_flow : s.nominal_flow_m3h,
    //     maxflow= flow_selected == "1" ? s.max_flow : s.max_flow_m3h,
    //   }).First();

    // this.meghaohm = megaOhmCalc.NewMeghaOhmCalculationCDIT(flow_per_modules, Convert.ToDouble(MinNominalandMaxFlow.minflow), Convert.ToDouble(MinNominalandMaxFlow.nominalflow), Convert.ToDouble(MinNominalandMaxFlow.maxflow), this.feedwaterConductivity, currentStack);

    // var silicaCalc = silicalc.newSilicaCalculationForCDIT(flow_per_modules, Convert.ToDouble(MinNominalandMaxFlow.minflow), Convert.ToDouble(MinNominalandMaxFlow.nominalflow), Convert.ToDouble(MinNominalandMaxFlow.maxflow), this.feedwaterConductivity, currentStack);



    // to convert ppm to ppb mutply sio2 to 1000
    // var siloutfinal = (Number(this.feedwaterInput.siO2) * 1000) * (1 - silicaCalc / 100);
    // // calculation of siout
    // let SiO2Out = Math.Round(siloutfinal, 3);

    if (Number(this.feedwaterInput.siO2) >= 2.0) {
      this.outputSummaryData.SIO2Ouput = "NA";
    }
    else {
      this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" : this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" : "<5";;
    }

    this.outputSummaryData.DPOuput =
      ((0.0423 * Math.pow(this.flowPerModule, 2) + 1.0056 * this.flowPerModule)).toFixed(2);

    if (this.feedwaterConductivity > 0) {
      this.saltpasageTest1 = (1 / this.meghaohm / this.feedwaterConductivity);
    }
    else {
      this.saltpasageTest1 = 0;
    }
    if (this.saltpasageTest1 > 1) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = this.saltpasageTest1;
    }
    let saltpasage = ((1 - this.saltpasageTest2) * 100).toFixed(2);
    //  saltpasage = Math.Round(100 * (1 -  this.saltpasageTest2), 2);
    // Saltrjectn_ouput_sugested.Text = Math.Round(saltpasage, 2).ToString();;
    // flow_permodule.Text = Math.Round(FlowMod, 2).ToString();;
    // numberof_permodule_sugested.Text = Number_of_modules.ToString();;

    // MX_recov_ouput_sugested.Text = maxRecoveryCalc.maxRecoveryVNX15and30CDIT(Number(this.cmnCalc.totalHardnessCaCO3),     Number(this.feedwaterInput.siO2)).ToString();
    // Resistvity_ouput_sugested.Text = Math.Round(this.meghaohm, 1).ToString();;
    // NH4_ouput_sugestedsd.Text = Math.Round(NH4 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // K_ouput_sugested.Text = Math.Round(K *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Na_ouput_sugested.Text = Math.Round(Na *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Mg_ouput_sugested.Text = Math.Round(Mg *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Ca_ouput_sugested.Text = Math.Round(Ca *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Sr_ouput_sugested.Text = Math.Round(Sr *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Ba_ouput_sugested.Text = Math.Round(Ba *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Fe_ouput_sugested.Text = Math.Round(Fe *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Cu_ouput_sugested.Text = Math.Round(Cu *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Al_ouput_sugested.Text = Math.Round(Al *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Mn_ouput_sugested.Text = Math.Round(Mn *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // CO_ouput_sugested.Text = Math.Round(CO3 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // HCO_ouput_sugested.Text = Math.Round(HCO3 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // NO_ouput_sugested.Text = Math.Round(NO3 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Cl_ouput_sugested.Text = Math.Round(Cl *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // F_ouput_sugested.Text = Math.Round(F *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // SO_ouput_sugested.Text = Math.Round(SO4 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // CO2_ouput_sugested.Text = Math.Round(CO2 *  this.saltpasageTest2 * 1000, 6).ToString().IslesserThanValue();
    // Totalproductivity_ouput_sugested.Text = product_flowrate.ToString();;
    // total_reject_totalfeed_totalproduct();
    this.assigningToOutput();
  }
  // pending
  VNX55E() {
    let Nom = 95, max = 92, Bnom = 95, Bmax = 92;
    let NaMax = 99.8,
      NaRemove = 0,
      Clremove = 99.8,
      salt_calculation,
      Low_Silica_Passage = 0.05,
      High_Silica_Passage = 0,
      High_Silica_Passage_Out = 0,
      fInterp, rlnterp, Bremov, saltpasage
    if (this.moduleSizeData.flow == "english") {

      if (this.moduleSizeData.pressure == "psi") {

        this.outputSummaryData.DPOuput = ((this.flowPerModule * 0.625) - 11.25).toFixed(1);
      }
      else {

        let num = ((this.flowPerModule * 0.625) - 11.25).toFixed(1);
        this.outputSummaryData.DPOuput = (Number(num) * 0.06895).toFixed(1);;
      }


    }
    else {

      if (this.moduleSizeData.pressure == "psi") {
        this.outputSummaryData.DPOuput = ((((this.flowPerModule * 4.402868) * 0.625) - 11.25)).toFixed(1);
      }
      else {
        this.outputSummaryData.DPOuput = ((((this.flowPerModule * 4.402868) * 0.625) - 11.25) * 0.06895).toFixed(1);;
      }
    }
    this.feedwaterConductivity

    if (this.feedwaterConductivity <= 1) {
      this.meghaohm = 18;
    }
    else if (this.feedwaterConductivity <= 10) {
      this.meghaohm = 17.5;
    }

    fInterp = (this.flowPerModule - 55.55) / (73.5 - 55.55);

    rlnterp = (this.maxRecov1 - 97) / 2;
    if (this.flowPerModule <= 55) {
      Bremov = 95;
    }
    else {
      Bremov = (fInterp * -3) + 95;
    }
    if (this.flowPerModule <= 73.5) {
      NaRemove = 99.8;
    }
    if (this.feedwaterConductivity > 0) {

      this.saltpasageTest1 = (1 / this.meghaohm / this.feedwaterConductivity);
    }
    else {
      this.saltpasageTest1 = 0;
    }

    if (this.saltpasageTest1 > 1) {
      this.saltpasageTest2 = 0.005;
    }
    else {
      this.saltpasageTest2 = this.saltpasageTest1;
    }
    this.saltpasageTest2 = 0.002;
    saltpasage = ((1 - this.saltpasageTest2) * 100).toFixed(2);
    salt_calculation = (1 - (NaRemove / 100));

    //Changes as per 21377
    let PH = 0.05 + ((this.flowPerModule - 55) / (73.5 - 55)) * (0.08 - 0.05);

    if (Number(this.feedwaterInput.siO2) >= 0.5) {
      this.outputSummaryData.SIO2Ouput = "NA";
    }
    else {
      // this.outputSummaryData.SIO2Ouput = Number(this.feedwaterInput.siO2) == 0 ? "" :
      //   silicalc.CalculateSilicaVnx(this.flowPerModule, Number(this.feedwaterInput.siO2), this.moduleSizeData.flow, 0.05, "VNX55E").ToString();
    }



    //for new boron calcualtion Bug #24142

    // If feed boron is > 150 ppb then do not calculate boron removal, report N/ A for Outlet boron and Concentrate boron values.On Module Selection page provide the following Caution Message: Product boron prediction not available at feed water boron concentrations above 150 ppb.
    //If feed boron concentration is ≤ 150 ppb as B, then follow module - specific rules below.NOTE: Flow per module = Q, Boron passage = P(L for low & nominal flow, H for high flow)
    if (Number(this.feedwaterInput.b) > 150) {

      this.outputSummaryData.BOuput = "NA";

    }
    else {
      //  this.outputSummaryData.BOuput = Number(this.feedwaterInput.b) == 0 ? "" : boronCalc.calculateBoron(this.flowPerModule, Number(this.feedwaterInput.b), this.moduleSizeData.flow, 0.05, "VNX55E").ToString();
    }
    // Max_recovery_out.Text = maxRecoveryCalc.maxRecoveryVNX55E2(Number(this.cmnCalc.totalHardnessCaCO3),     Number(this.feedwaterInput.siO2)).ToString();
    // //Max_recovery_out.Text = max_recovery.ToString(); ;
    // Saltrjectn_ouput_sugested.Text = Math.Round(saltpasage, 1).ToString();
    // flow_permodule.Text = Math.Round(FlowMod, 1).ToString();
    // numberof_permodule_sugested.Text = Number_of_modules.ToString();

    // NH4_ouput_sugestedsd.Text = Math.Round(NH4 * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // K_ouput_sugested.Text = Math.Round(K * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Na_ouput_sugested.Text = Math.Round(Na * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Mg_ouput_sugested.Text = Math.Round(Mg * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Ca_ouput_sugested.Text = Math.Round(Ca * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Sr_ouput_sugested.Text = Math.Round(Sr * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Ba_ouput_sugested.Text = Math.Round(Ba * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Fe_ouput_sugested.Text = Math.Round(Fe * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Cu_ouput_sugested.Text = Math.Round(Cu * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Al_ouput_sugested.Text = Math.Round(Al * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Mn_ouput_sugested.Text = Math.Round(Mn * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // CO_ouput_sugested.Text = Math.Round(CO3 * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // HCO_ouput_sugested.Text = Math.Round(HCO3 * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // NO_ouput_sugested.Text = Math.Round(NO3 * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Cl_ouput_sugested.Text = Math.Round(Cl * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // F_ouput_sugested.Text = Math.Round(F * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // SO_ouput_sugested.Text = Math.Round(SO4 * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // CO2_ouput_sugested.Text = Math.Round(CO2 * salt_calculation * 1000, 6).ToString().IslesserThanValue();
    // Totalproductivity_ouput_sugested.Text = product_flowrate.ToString();
    // Resistvity_ouput_sugested.Text = Math.Round(this.meghaohm, 1).ToString();;
    // total_reject_totalfeed_totalproduct();
    this.assigningToOutput();
  }

  generatePdf() {
    const documentDefinition = {

      content: [
        { text: 'System Summary' },
        {
          layout: '', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['54%', '30%'],

            body: [
              [this.pdflabels.TxtProductFlowrate, 'Second'],
              [this.pdflabels.TxtModuleType, 'Value 2'],
              [this.pdflabels.TxtNumberofModules, this.moduleSizeData.numberOfModule + ' µS/cm'],
              [this.pdflabels.TxtFlowperModule, 'Val 3'],
              [this.pdflabels.TxtFeedwaterConductivity, this.cmnCalc.conductvity],
              [this.pdflabels.TxtFeedwaterConductivityEquivalent, this.cmnCalc.feedWaterConductivity],
              [this.pdflabels.TxtTotalExchangeableAnions, this.cmnCalc.totalExchangableAnions + ' ppm as CaCO₃'],
              [this.pdflabels.TxtMaximumSystemRecovery, 'Val 3'],
              [this.pdflabels.TxtProductWaterResistivity, 'Val 3'],
              [this.pdflabels.TxtProductWaterConductivity, 'Val 3'],
              [this.pdflabels.TxtSaltRejection, 'Val 3'],
              [this.pdflabels.TxtPressureDrop, 'Val 3'],
              [this.pdflabels.TxtTotalHardness, this.cmnCalc.totalHardnessCaCO3 + ' ppm as CaCO₃'],
            ]
          }
        },

        { text: 'Water Analysis' },
        {
          layout: '', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 0,
            widths: ['20%', '20%', '23%', '20%'],

            body: [

              ['Species', 'Inlet(ppm as ion)', 'Outlet(ppb as ion)', 'Concentrate (ppm as ion)'],
              ['NH₄', this.feedwaterInput.nH4, this.outputSummaryData.NH4Output, ''],
              ['K', this.feedwaterInput.k, this.outputSummaryData.KOutput, ''],
              ['Na', this.feedwaterInput.na, this.outputSummaryData.NaOutput, ''],
              ['Mg', this.feedwaterInput.mg, this.outputSummaryData.MgOutput, ''],
              ['Ca', this.feedwaterInput.ca, this.outputSummaryData.CaOutput, ''],
              ['Sr', this.feedwaterInput.sr, this.outputSummaryData.SrOutput, ''],
              ['Ba', this.feedwaterInput.ba, this.outputSummaryData.BaOutput, ''],
              ['Fe', this.feedwaterInput.fe, this.outputSummaryData.FeOutput, ''],
              ['Cu', this.feedwaterInput.cu, this.outputSummaryData.CuOutput, ''],
              ['Al', this.feedwaterInput.al, this.outputSummaryData.AlOutput, ''],
              ['Mn', this.feedwaterInput.mn, this.outputSummaryData.MnOutput, ''],
              ['CO3', this.feedwaterInput.cO3, this.outputSummaryData.CO3Output, ''],
              ['HCO₃', this.feedwaterInput.hcO3, this.outputSummaryData.HCOOutput, ''],
              ['NO₃', this.feedwaterInput.nO3, this.outputSummaryData.NOOutput, ''],
              ['Cl', this.feedwaterInput.cl, this.outputSummaryData.ClOutput, ''],
              ['F', this.feedwaterInput.f, this.outputSummaryData.FOutput, ''],
              ['SO₄', this.feedwaterInput.sO4, this.outputSummaryData.SOOutput, ''],
              ['B', this.feedwaterInput.b, '', ''],
              ['SiO₂', this.feedwaterInput.siO2, '', ''],
              ['CO₂', this.feedwaterInput.cO2, '', ''],
              ['pH', this.feedwaterInput.pH7, '', ''],
              ['Calc pH', this.feedwaterInput.calcpH7, 'NA', ''],
              ['Temp °C', (this.feedwaterInput.temp + '' + this.feedwaterInput.tempUnit), '', ''],

            ]
          }
        }
      ]
    };


    pdfMake.createPdf(documentDefinition).open();
  }

  assigningToOutput() {
    this.outputSummaryData.ResistvityOutput = this.meghaohm.toFixed(2);
    this.outputSummaryData.NH4Output = (Number(this.feedwaterInput.nH4) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.KOutput = (Number(this.feedwaterInput.k) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.NaOutput = (Number(this.feedwaterInput.na) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.MgOutput = (Number(this.feedwaterInput.mg) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.CaOutput = (Number(this.feedwaterInput.ca) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.SrOutput = (Number(this.feedwaterInput.sr) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.BaOutput = (Number(this.feedwaterInput.ba) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.FeOutput = (Number(this.feedwaterInput.fe) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.CuOutput = (Number(this.feedwaterInput.cu) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.AlOutput = (Number(this.feedwaterInput.al) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.MnOutput = (Number(this.feedwaterInput.mn) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.CO3Output = (Number(this.feedwaterInput.cO3) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.HCOOutput = (Number(this.feedwaterInput.hcO3) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.NOOutput = (Number(this.feedwaterInput.nO3) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.ClOutput = (Number(this.feedwaterInput.cl) * this.saltpasageTest2 * this.commonmultply).toFixed(6);
    this.outputSummaryData.FOutput = (Number(this.feedwaterInput.f) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.SOOutput = (Number(this.feedwaterInput.sO4) * this.saltpasageTest2 * this.commonmultply).toString();
    this.outputSummaryData.CO2Output = (Number(this.feedwaterInput.cO2) * this.saltpasageTest2 * this.commonmultply).toString();
  }

}
