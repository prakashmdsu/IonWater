export interface ModuleSize {
    // id: number;
    // moduleFamilyId: number;
    // moduleFamily: string;
    // diluteCellsperStack: number;
    // stacksperModule: number;
    // tempertaureCorection: number;
    // maxStartupCurrent: number;
    // maxFCE: number;
    // minFlow: number;
    // maxFlow: number;
    // minTemp: number;
    // maxTemp: number;
    // cellResistance: number;
    // minStartupCurrent: number;
    // minVoltage: number;
    // maxVoltage: number;

    id: number;
    moduleFamilyId: number;
    moduleSize: string;
    maxFeedSilica: number;
    maxFeedHardness: number;
    maxFeedC12: number;
    maxCurrent: number;
    maxFCE: number;
    minFlow: number;
    nominalFlowgpm: number;
    nominalFlowgpm125: number;
    nominalFlowm3h125: number;
    maxFlow: number;
    minTemp: number;
    maxTemp: number;
    maxToc: number;
    maxBoron: number;
    minFlowm3h: number;
    maxFlowm3h: number;
    nominalFlowm3h: number;
    diluteCellsperStack: number;
    stacksperModule: number;
    tempertaureCorection: number;
    maxStartupCurrent: number;
    cellResistance: number;
    minStartupCurrent: number;
    minVoltage: number;
    maxVoltage: number
}