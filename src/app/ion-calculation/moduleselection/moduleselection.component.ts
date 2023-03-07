import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenralserviceService } from '../../CommonServices/genralservice.service';
import { ModuleSelectionHttpService } from './Share/Module-SelectionHttp-Service.service';
import { ModuleSize } from './Share/ModuleSize';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ModuleFeedWater } from './Share/ModuleSlection';
import { ErrorMessage } from '../../CommonServices/error-warning/messageinterface';

import { MessageService } from '../warningmessage/share/message.service';
import { ERRORMESSAGE } from 'src/app/CommonServices/error-warning/error-messages';
import { Feedwater } from '../feedwater/Share/FeedWaterInterface';
import { FeedWaterInputService } from '../services/feedwater.service';

@Component({
  selector: 'app-moduleselection',
  templateUrl: './moduleselection.component.html',
  styleUrls: ['./moduleselection.component.css']
})

export class ModuleselectionComponent implements OnInit {

  moduleSizeSystem: ModuleSize[] = [];
  message: ErrorMessage[] = [];
  feedwaterInput: Feedwater = {};
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private services: ModuleSelectionHttpService<ModuleFeedWater>,
    private moduleSizeservices: ModuleSelectionHttpService<ModuleSize>,
    private genrelService: GenralserviceService,
    private messageService: MessageService,
    private feedwaterService: FeedWaterInputService,
    @Inject('ERRORMESSAGE') private errormessage: ErrorMessage[]
  ) { }
  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get("id") == '') {
      this.router.navigate(["home/feedwater"]);
    }
    else {

      this.feedwaterService.restoreFeedwaterInput();
      this.feedwaterService.feedWaterInput$.subscribe(feedWaterInputResult => {
        this.feedwaterInput = feedWaterInputResult;

      })

      this.moduleSelection.patchValue({
        feedwaterId: this.route.snapshot.queryParamMap.get("id")
      })

      this.services.HttpGet("moduleselection/" + this.route.snapshot.queryParamMap.get("id")).subscribe(res => {
        this.moduleSelection.patchValue(res);
        this.loadModuleSize();
      }, err => {
      })

    }
    this.calculateFlowperModule()
  }

  moduleSelection = this.fb.group({
    feedwaterId: ['', Validators.required],
    id: ['', Validators.required],
    pressure: ['', Validators.required],
    flow: ['', Validators.required],
    moduleFamily: ['', Validators.required],
    productFamily: ['', Validators.required],
    moduleSize: ['', Validators.required],
    numberOfModule: [1, Validators.required],
    productFlowRate: [0, Validators.required],
    flowPerModule: ['', Validators.required],
  })

  updateModuleSlection() {

    if (this.moduleSelection.value.id === '') {
      this.services.HttpPost(this.moduleSelection.value, "moduleselection").subscribe(res => {
        this.router.navigate(["home/powercalculator/"], {
          queryParams: { id: this.route.snapshot.queryParamMap.get("id") },
        });
      }, err => {

      });
    }
    else {
      this.services.HttpPut(this.moduleSelection.value, "moduleselection/" + this.moduleSelection.value.id).subscribe(res => {
        this.router.navigate(["home/powercalculator/"], {
          queryParams: { id: this.route.snapshot.queryParamMap.get("id") },
        });
      }, err => {

      });

      this.feedwaterService.updateModuleSelectionInput(this.moduleSelection.value)
      this.validateData();
    }


  }
  calculateFlowperModule() {
    let flowperModule = this.genrelService.calculateFlowperModule(this.moduleSelection.value.numberOfModule, this.moduleSelection.value.productFlowRate)
    this.moduleSelection.patchValue({
      flowPerModule: flowperModule
    })
    this.validateData()
  }
  Back() {
    this.router.navigate(["home/feedwater/"], {
      queryParams: { id: this.moduleSelection.value.feedwaterId },
    });
  }

  loadModuleSize() {
    this.moduleSizeservices.HttpModulesizeGet("modulesize/" + this.moduleSelection.value.moduleFamily).subscribe(res => {
      this.moduleSizeSystem = res;
      console.log(res)
      this.validateData();
    }, err => {

    });
  }

  validateData() {

    let temp = Number(this.feedwaterInput.temp);
    let modulesize = this.moduleSizeSystem.filter(obj => {
      return obj.id?.toString() === this.moduleSelection.value.moduleSize
    })[0];
    console.log(modulesize)
    this.feedwaterService.updateModuleSizeRecord(modulesize);
    this.messageService.clearMessageByPage('moduleselection');
    let messagestobedata: ErrorMessage = {};

    let minFlow = this.moduleSelection.value.flow == 'english' ? modulesize.minFlow : modulesize.minFlowm3h;
    let maxFlow = this.moduleSelection.value.flow == 'english' ? modulesize.maxFlow : modulesize.maxFlowm3h;
    if (this.moduleSelection.value.flowPerModule < minFlow) {
      messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 1 && data.language == 'en')[0] };
      messagestobedata.errormessage = messagestobedata.errormessage + minFlow.toString() + ' gpm';
      this.messageService.add(messagestobedata);
    }

    if (this.moduleSelection.value.flowPerModule > maxFlow) {

      messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 2 && data.language == 'en')[0] };
      messagestobedata.errormessage = messagestobedata.errormessage + maxFlow.toString() + ' gpm';
      this.messageService.add(messagestobedata);
    }


    if (this.moduleSelection.value.moduleSize == "35" || this.moduleSelection.value.moduleSize == "36" || this.moduleSelection.value.moduleSize == "20" || this.moduleSelection.value.moduleSize == "21") {

      if (this.feedwaterInput.tempUnit == "°C") {
        if (temp < 20 || temp >= 45) {

          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 3 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }
        else if (temp > 45 && temp < 60) {
          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 4 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }
      }
      else {
        if (temp < 68.0 || temp >= 113.0) {
          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 5 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }
        else if (temp > 113 && temp < 140) {
          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 4 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }
      }
    }
    else if (this.moduleSelection.value.moduleSize == "12" || this.moduleSelection.value.moduleSize == "13" || this.moduleSelection.value.moduleSize == "14" || this.moduleSelection.value.moduleSize == "15" || this.moduleSelection.value.moduleSize == "16" || this.moduleSelection.value.moduleSize == "17") {
      if (this.feedwaterInput.tempUnit == "°C") {
        if (temp < 5 || temp > 60) {
          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 6 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }
        else if (temp >= 45 && temp <= 60) {
          // temp_outrange.Text = "Caution: Select LX-HI module only due higher temperature";
        }
      }
      else {
        if (temp < 41 || temp > 140) {
          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 7 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }
        else if (temp >= 113 && temp <= 140) {
          // temp_outrange.Text = "Caution: Select LX-HI module only due higher temperature";
        }
      }
    }
    else if (this.moduleSelection.value.moduleSize == "39" || this.moduleSelection.value.moduleSize == "40") {
      if (this.feedwaterInput.tempUnit == "°C") {
        if (temp >= 5 && temp < 10) {
          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 8 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }
      }
      else {
        if (temp >= 41 && temp < 50) {
          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 9 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }

      }
    }
    else {
      if (this.feedwaterInput.tempUnit == "°C") {
        if (temp < 5 || temp > 45) {
          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 10 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }

      }
      else {
        if (temp < 41 || temp > 113) {
          messagestobedata = { ... this.errormessage.filter(data => data.errorcode === 11 && data.language == 'en')[0] };
          this.messageService.add(messagestobedata);
        }
      }
    }
  }
}
