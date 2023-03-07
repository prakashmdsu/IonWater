import { Injectable } from '@angular/core';
import { Feedwater } from '../ion-calculation/feedwater/Share/FeedWaterInterface';
import { FeedWaterSummary } from '../ion-calculation/feedwatersummary/shared/feedwatersummary';
import { CommonValuesFeedWater } from './common-valuesfeedwater';

@Injectable({
  providedIn: 'root'
})
export class GenralserviceService {
  fwCommonValue = CommonValuesFeedWater;
  constructor() { }

  calculateFlowperModule(numberOfModule: number, productFlowrate: number): number {
    return (productFlowrate / numberOfModule);
  }

  calculateFce() {

  }

  totalionCationAnion(feedwaterForm: Feedwater): FeedWaterSummary {
    let feewatersummary: FeedWaterSummary = {};
    feewatersummary.cationsTotal =
      (Number(feedwaterForm.nH4) * this.fwCommonValue.Nh4Ep +
        Number(feedwaterForm.k) * this.fwCommonValue.kEp +
        Number(feedwaterForm.na) * this.fwCommonValue.NaEp +
        Number(feedwaterForm.mg) * this.fwCommonValue.MgEp +
        Number(feedwaterForm.ca) * this.fwCommonValue.CaEp +
        Number(feedwaterForm.sr) * this.fwCommonValue.SrEp +
        Number(feedwaterForm.ba) * this.fwCommonValue.BaEp +
        Number(feedwaterForm.fe) * this.fwCommonValue.FeEp +
        Number(feedwaterForm.cu) * this.fwCommonValue.CuEp +
        Number(feedwaterForm.al) * this.fwCommonValue.AlEp +
        Number(feedwaterForm.mn) * this.fwCommonValue.MnEp).toFixed(2);

    feewatersummary.anionsTotal = (
      (Number(feedwaterForm.cO3) * this.fwCommonValue.Co3Ep) +
      (Number(feedwaterForm.hcO3) * this.fwCommonValue.Hco3Ep) +
      (Number(feedwaterForm.nO3) * this.fwCommonValue.No3Ep) +
      (Number(feedwaterForm.cl) * this.fwCommonValue.ClEp) +
      (Number(feedwaterForm.f) * this.fwCommonValue.FEp) +
      (Number(feedwaterForm.sO4) * this.fwCommonValue.So4Ep)).toFixed(2);


    feewatersummary.totalHardnessCaCO3 = ((Number(feedwaterForm.ca) * this.fwCommonValue.CaEp) +
      (Number(feedwaterForm.mg) * this.fwCommonValue.MgEp)).toFixed(2);


    feewatersummary.conductvity = (((
      (Number(feedwaterForm.nH4) * this.fwCommonValue.Nh4Ep * 73.7) +
      (Number(feedwaterForm.k) * this.fwCommonValue.kEp * 73.5) +
      (Number(feedwaterForm.na) * this.fwCommonValue.NaEp * 50.11) +
      (Number(feedwaterForm.mg) * this.fwCommonValue.MgEp * 53.06) +
      (Number(feedwaterForm.ca) * this.fwCommonValue.CaEp * 59.5) +
      (Number(feedwaterForm.sr) * this.fwCommonValue.SrEp * 59.46) +
      (Number(feedwaterForm.ba) * this.fwCommonValue.BaEp * 63.9) +
      (Number(feedwaterForm.fe) * this.fwCommonValue.FeEp * 53.5) +
      (Number(feedwaterForm.cu) * this.fwCommonValue.CuEp * 56.6) +
      (Number(feedwaterForm.al) * this.fwCommonValue.AlEp * 61) +
      (Number(feedwaterForm.mn) * this.fwCommonValue.MnEp * 53.5) +
      (Number(feedwaterForm.hcO3) * this.fwCommonValue.Hco3Ep * 44.5) +
      (Number(feedwaterForm.cO3) * this.fwCommonValue.Co3Ep * 72) +
      (Number(feedwaterForm.sO4) * this.fwCommonValue.So4Ep * 80) +
      (Number(feedwaterForm.cl) * this.fwCommonValue.ClEp * 76.35) +
      (Number(feedwaterForm.nO3) * this.fwCommonValue.No3Ep * 71.42) +
      (Number(feedwaterForm.f) * this.fwCommonValue.FEp * 55.4)) / 50) + 0.055).toFixed(2);


    feewatersummary.feedWaterConductivity = (
      Number(feewatersummary.conductvity)
      + (Number(feedwaterForm.cO2) * 2.79)
      + (Number(feedwaterForm.siO2) * 2.04)).toFixed(2);


    if (Number(feewatersummary.cationsTotal) > Number(feewatersummary.anionsTotal)) {
      feewatersummary.tds = Number(feewatersummary.cationsTotal);
    }
    else {
      feewatersummary.tds = Number(feewatersummary.anionsTotal);
    }

    let hco3;

    if (Number(feedwaterForm.hcO3) == 0) {
      hco3 = 0.001;
    }
    else {
      hco3 = Number(feedwaterForm.hcO3) * 0.82;
    }

    feewatersummary.totalExchangableAnions =
      ((feewatersummary.tds - hco3) + (hco3 * 1.7) + (Number(feedwaterForm.cO2) * 1.14 * 1.7)).toFixed(2);



    return feewatersummary
  }

  public megaOhmCalculationForVnx(flowmod: number, minimumFlowMod: number,
    NominalFlowMod: number, maxFlowmod: number, feedwaterConductivity: number) {
    let lowFlowMeg = this.calculateNominaminalMegaOhmVNX(feedwaterConductivity, "MIN");
    let nomFlowMeg = this.calculateNominaminalMegaOhmVNX(feedwaterConductivity, "NOM");
    let maxFlowMeg = this.calculateNominaminalMegaOhmVNX(feedwaterConductivity, "MAX");
    if (flowmod == minimumFlowMod) {
      //y = -0.0375x + 18
      return lowFlowMeg;
    }
    // if it is between minimum  flow and nominal flow  as per red min ticket Bug #25307
    else if (flowmod > minimumFlowMod && flowmod < NominalFlowMod) {
      //SCALC = SNOM + [(FGIVEN – FNOM)(SMIN – SNOM) / (FMIN – FNOM)]
      //MCALC =         MNOM + (FGIVEN – FNOM)(MMAX – MNOM)/ (FMAX – FNOM)
      return Number((nomFlowMeg + (flowmod - NominalFlowMod) * (lowFlowMeg - nomFlowMeg) / (minimumFlowMod - NominalFlowMod)).toFixed(2));
    }
    //for nominal flowmod
    else if (flowmod == NominalFlowMod) {
      //y = -0.075x + 18
      return nomFlowMeg;

    }
    //for maximum 
    else if (flowmod == maxFlowmod) {
      //y = -0.2625x + 18
      return maxFlowMeg;
    }
    // if it is between nominal flow and max flow  as per red min ticket Bug #25307
    else if (flowmod > NominalFlowMod && flowmod < maxFlowmod) {
      //MCALC = MNOM + (FGIVEN – FNOM)(MMAX – MNOM)/ (FMAX – FNOM)
      return Number((nomFlowMeg + (flowmod - NominalFlowMod) * (maxFlowMeg - nomFlowMeg) / (maxFlowmod - NominalFlowMod)).toFixed(2));
    }
    return 0.0;
  }

  public calculateNominaminalMegaOhmVNX(feedwaterConductivity: number, calculationFor: string) {
    if (calculationFor == "MIN") {
      return Number(((-0.0375 * feedwaterConductivity) + 18).toFixed(2));
    }
    else if (calculationFor == "NOM") {
      return Number(((-0.075 * feedwaterConductivity) + 18).toFixed(2));
    }
    else {
      return Number(((-0.2625 * feedwaterConductivity) + 18).toFixed(2));
    }
  }

}
