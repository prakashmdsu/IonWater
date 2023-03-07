

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { PowercalculatorSummary } from "../estimatedpowerrequirements/share/power-calculator-summary";
import { Feedwater } from "../feedwater/Share/FeedWaterInterface";
import { ModuleSize } from "../moduleselection/Share/ModuleSize";
import { ModuleFeedWater } from "../moduleselection/Share/ModuleSlection";

@Injectable({
    providedIn: "root",
})
export class FeedWaterInputService {
    private readonly feedwaterInput = new BehaviorSubject<Feedwater>({});
    private readonly moduleSelectionInput = new BehaviorSubject<ModuleFeedWater>({});
    private readonly powerCalulatorOutputSummary = new BehaviorSubject<PowercalculatorSummary>({});
    private readonly moduleSizeRecord = new BehaviorSubject<ModuleSize>({
        id: 0,
        moduleFamilyId: 0,
        moduleSize: '',
        maxFeedSilica: 0,
        maxFeedHardness: 0,
        maxFeedC12: 0,
        maxCurrent: 0,
        maxFCE: 0,
        minFlow: 0,
        nominalFlowgpm: 0,
        nominalFlowgpm125: 0,
        nominalFlowm3h125: 0,
        maxFlow: 0,
        minTemp: 0,
        maxTemp: 0,
        maxToc: 0,
        maxBoron: 0,
        minFlowm3h: 0,
        maxFlowm3h: 0,
        nominalFlowm3h: 0,
        diluteCellsperStack: 0,
        stacksperModule: 0,
        tempertaureCorection: 0,
        maxStartupCurrent: 0,
        cellResistance: 0,
        minStartupCurrent: 0,
        minVoltage: 0,
        maxVoltage: 0
    });
    feedWaterInput$: Observable<Feedwater>;
    moduleSelectionInput$: Observable<ModuleFeedWater>;
    moduleSizeRecord$: Observable<ModuleSize>;
    powerCalulatorOutputSummary$: Observable<PowercalculatorSummary>;


    constructor() {
        this.feedWaterInput$ = this.feedwaterInput.asObservable();
        this.moduleSelectionInput$ = this.moduleSelectionInput.asObservable();
        this.moduleSizeRecord$ = this.moduleSizeRecord.asObservable();
        this.powerCalulatorOutputSummary$ = this.powerCalulatorOutputSummary.asObservable();
    }

    updateFeedwaterInput(data: Feedwater) {
        localStorage.setItem("feedwaterinput", JSON.stringify(data));
        this.feedwaterInput.next(data);
    }
    updateModuleSelectionInput(data: ModuleFeedWater) {
        localStorage.setItem("moduleselctioninput", JSON.stringify(data));
        this.moduleSelectionInput.next(data);
    }

    restoreFeedwaterInput() {
        if (localStorage.getItem("feedwaterinput")) {
            let data = JSON.parse(localStorage.getItem('feedwaterinput') || '{}') as Feedwater;
            this.feedwaterInput.next(data);
        }
    }

    updateModuleSizeRecord(data: ModuleSize) {
        this.moduleSizeRecord.next(data)
    }

    updatePowerCalculatorOutput(powerCalculatorData: PowercalculatorSummary) {
        this.powerCalulatorOutputSummary.next(powerCalculatorData)
    }

}