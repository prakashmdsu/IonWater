import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonValuesFeedWater } from 'src/app/CommonServices/common-valuesfeedwater';
import { GenralserviceService } from '../../CommonServices/genralservice.service';
import { HttpServiceService } from '../../CommonServices/http-service.service';
import { FeedWaterSummary } from '../feedwatersummary/shared/feedwatersummary';
import { FeedWaterInputService } from '../services/feedwater.service';
import { Feedwater } from './Share/FeedWaterInterface';
@Component({
  selector: 'app-feedwater',
  templateUrl: './feedwater.component.html',
  styleUrls: ['./feedwater.component.css']
})
export class FeedwaterComponent implements OnInit {
  feedWaterInput: Feedwater | any;
  fwCommonValue = CommonValuesFeedWater;
  cmnCalc: FeedWaterSummary = {}


  constructor(private router: Router, private fb: FormBuilder,
    private services: HttpServiceService<Feedwater>,
    private genrelService: GenralserviceService,
    private route: ActivatedRoute,

    private feedWaterService: FeedWaterInputService
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get("id") !== '') {
      this.services.HttpGet("feedwater/" + this.route.snapshot.queryParamMap.get("id")).subscribe(res => {
        this.feedwaterForm.patchValue(res);
        this.feedWaterInput = this.feedwaterForm.value;
        this.commonCalculation();
      }, err => {

      })
    }
  }


  feedwaterForm = this.fb.group({
    id: [''],
    hotwaterSensation: ['no'],
    apllicationName: ['', Validators.required],
    applicationType: ['', Validators.required],
    nH4: [0.01],
    k: [0.01],
    na: [0.01],
    mg: [0.01],
    ca: [0.01],
    sr: [0.01],
    ba: [0.01],
    fe: [0.01],
    cu: [0.01],
    al: [0.01],
    mn: [0.01],
    cO3: [0.01],
    hcO3: [0.01],
    nO3: [0.01],
    cl: [0.01],
    f: [0.01],
    sO4: [0.01],
    b: [0.01],
    siO2: [0.01],
    cO2: [0.01],
    h2S: [0.01],
    pH7: [7],
    calcpH7: [0.01],
    toc: [0.01],
    temp: [25],
    tempUnit: ['°C', Validators.required],
    nH4asppm: [0.01],
    kasppm: [0.01],
    naasppm: [0.01],
    mgasppm: [0.01],
    caasppm: [0.01],
    srasppm: [0.01],
    baasppm: [0.01],
    feasppm: [0.01],
    cuasppm: [0.01],
    alasppm: [0.01],
    mnasppm: [0.01],
    cO3asppm: [0.01],
    hcO3asppm: [0.01],
    nO3asppm: [0.01],
    clasppm: [0.01],
    fasppm: [0.01],
    sO4asppm: [0.01],

    chkCalculateCO2: [false],

  });

  calculatePhValue() {
    let HCO3 = 0;
    let Co2 = 0;
    let phcalc1 = '0';
    let phcalc2 = '0';
    let phcalc3 = '0';
    let phcalc4 = '0';
    let phcalc5 = '0';
    if (this.feedwaterForm.value.hcO3 * 0.82 == 0) {
      HCO3 = 0.001;
    }
    else {
      HCO3 = this.feedwaterForm.value.hcO3 * 0.82;
    }
    let Ck = (0.000010512996 + 2192580.4) * Math.exp(-(this.feedwaterForm.value.pH7) / 0.43429438);
    let C2K = (-0.0000037461988 + 20111.272) * Math.exp(-(this.feedwaterForm.value.pH7) / 0.43439011);

    if ((this.feedwaterForm.value.cO3) > 0 || (this.feedwaterForm.value.hcO3) > 0 || (this.feedwaterForm.value.cO2) > 0) {

      if ((this.feedwaterForm.value.hcO3) > 0 && (this.feedwaterForm.value.cO2) > 0 && (this.feedwaterForm.value.cO3) == 0) {
        phcalc1 = (6.1 + Math.log((this.feedwaterForm.value.hcO3) / (this.feedwaterForm.value.cO2) * 1.136) / Math.log(10)).toFixed(2);
      }
      if (((this.feedwaterForm.value.cO3) > 0 && (this.feedwaterForm.value.hcO3) > 0 && (this.feedwaterForm.value.cO2) == 0)) {
        phcalc2 = (10.1 + Math.log((this.feedwaterForm.value.cO3) / (this.feedwaterForm.value.hcO3)) / Math.log(10)).toFixed(2);
      }
      if ((this.feedwaterForm.value.cO3) == 0 && (this.feedwaterForm.value.hcO3) == 0 && (this.feedwaterForm.value.cO2) > 0) {
        phcalc3 = '4.3';
      }
      if (((this.feedwaterForm.value.cO2) == 0 && (this.feedwaterForm.value.hcO3) == 0 && (this.feedwaterForm.value.cO3) > 0)) {
        phcalc4 = '12.3';
      }
      if (((this.feedwaterForm.value.cO2) == 0 && (this.feedwaterForm.value.cO3) == 0 && (this.feedwaterForm.value.hcO3) > 0)) {
        phcalc5 = '8.3';
      }

      if (phcalc1 == '0') {
        if (phcalc2 == '0') {
          if (phcalc3 == '0') {
            if (phcalc4 == '0') {
              if (phcalc5 == '0') {
                this.feedwaterForm.patchValue
                  ({ calcpH7: 7 });
              }
              else {
                this.feedwaterForm.patchValue
                  ({ calcpH7: (phcalc5) });
              }
            }
            else {
              this.feedwaterForm.patchValue
                ({ calcpH7: (phcalc4) });
            }
          }
          else {
            this.feedwaterForm.patchValue
              ({ calcpH7: (phcalc3) });
          }
        }
        else {
          this.feedwaterForm.patchValue
            ({ calcpH7: (phcalc2) });
        }
      }

      else {
        this.feedwaterForm.patchValue
          ({ calcpH7: (phcalc1) });
      }
    }
  }


  saveFeedWater() {
    this.feedWaterService.updateFeedwaterInput(this.feedwaterForm.value);
    if (this.feedwaterForm.value.id === '') {
      this.services.HttpPost(this.feedwaterForm.value, "feedwater").subscribe(res => {
        console.log(res)
        this.router.navigate(["home/moduleselection/"], {
          queryParams: { id: res.id },
        });
      }, err => {
        console.log(err)
      });
    }
    else {
      this.services.HttpPut(this.feedwaterForm.value, "feedwater/" + this.feedwaterForm.value.id).subscribe(res => {
        this.router.navigate(["home/moduleselection/"], {
          queryParams: { id: this.feedwaterForm.value.id },
        });
      }, err => {

      });
    }

  }

  commonCalculation() {
    this.feedwaterForm.patchValue
      (
        {
          nH4asppm: (this.feedwaterForm.value.nH4 * this.fwCommonValue.Nh4Ep).toFixed(2),
          kasppm: (this.feedwaterForm.value.k * this.fwCommonValue.kEp).toFixed(2),
          naasppm: (this.feedwaterForm.value.na * this.fwCommonValue.NaEp).toFixed(2),
          mgasppm: (this.feedwaterForm.value.mg * this.fwCommonValue.MgEp).toFixed(2),
          caasppm: (this.feedwaterForm.value.ca * this.fwCommonValue.CaEp).toFixed(2),
          srasppm: (this.feedwaterForm.value.sr * this.fwCommonValue.SrEp).toFixed(2),
          baasppm: (this.feedwaterForm.value.ba * this.fwCommonValue.BaEp).toFixed(2),
          feasppm: (this.feedwaterForm.value.fe * this.fwCommonValue.FeEp).toFixed(2),
          cuasppm: (this.feedwaterForm.value.cu * this.fwCommonValue.CuEp).toFixed(2),
          alasppm: (this.feedwaterForm.value.al * this.fwCommonValue.AlEp).toFixed(2),
          mnasppm: (this.feedwaterForm.value.mn * this.fwCommonValue.MnEp).toFixed(2),
          cO3asppm: (this.feedwaterForm.value.cO3 * this.fwCommonValue.Co3Ep).toFixed(2),
          hcO3asppm: (this.feedwaterForm.value.hcO3 * this.fwCommonValue.Hco3Ep).toFixed(2),
          nO3asppm: (this.feedwaterForm.value.nO3 * this.fwCommonValue.No3Ep).toFixed(2),
          clasppm: (this.feedwaterForm.value.cl * this.fwCommonValue.ClEp).toFixed(2),
          fasppm: (this.feedwaterForm.value.f * this.fwCommonValue.FEp).toFixed(2),
          sO4asppm: (this.feedwaterForm.value.sO4 * this.fwCommonValue.So4Ep).toFixed(2),
        },
      );
    this.cmnCalc = this.genrelService.totalionCationAnion(this.feedwaterForm.value);
  }

  convertToPpm() {
    this.feedwaterForm.patchValue
      (
        {
          nH4: (this.feedwaterForm.value.nH4asppm / this.fwCommonValue.Nh4Ep).toFixed(2),
          k: (this.feedwaterForm.value.kasppm / this.fwCommonValue.kEp).toFixed(2),
          na: (this.feedwaterForm.value.naasppm / this.fwCommonValue.NaEp).toFixed(2),
          mg: (this.feedwaterForm.value.mgasppm / this.fwCommonValue.MgEp).toFixed(2),
          ca: (this.feedwaterForm.value.caasppm / this.fwCommonValue.CaEp).toFixed(2),
          sr: (this.feedwaterForm.value.srasppm / this.fwCommonValue.SrEp).toFixed(2),
          ba: (this.feedwaterForm.value.baasppm / this.fwCommonValue.BaEp).toFixed(2),
          fe: (this.feedwaterForm.value.feasppm / this.fwCommonValue.FeEp).toFixed(2),
          cu: (this.feedwaterForm.value.cuasppm / this.fwCommonValue.CuEp).toFixed(2),
          al: (this.feedwaterForm.value.alasppm / this.fwCommonValue.AlEp).toFixed(2),
          mn: (this.feedwaterForm.value.mnasppm / this.fwCommonValue.MnEp).toFixed(2),
          cO3: (this.feedwaterForm.value.cO3asppm / this.fwCommonValue.Co3Ep).toFixed(2),
          hcO3: (this.feedwaterForm.value.hcO3asppm / this.fwCommonValue.Hco3Ep).toFixed(2),
          nO3: (this.feedwaterForm.value.nO3asppm / this.fwCommonValue.No3Ep).toFixed(2),
          cl: (this.feedwaterForm.value.clasppm / this.fwCommonValue.ClEp).toFixed(2),
          f: (this.feedwaterForm.value.fasppm / this.fwCommonValue.FEp).toFixed(2),
          sO4: (this.feedwaterForm.value.sO4asppm / this.fwCommonValue.So4Ep).toFixed(2),
        },
      );
  }
}
