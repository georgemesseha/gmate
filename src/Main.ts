//import ch from "chalk";
// import figlet from "figlet";
//import * as cp from "child_process"
import { CurrentTerminal as Terminal } from "decova-terminal";
import { DevelopMyPackages } from "./local-tools-impl/__old/DevelopMyPackages";
import { DevelopMyTools } from "./local-tools-impl/__old/DevelopMyTools";
import { InsideExistingProject as InsideCurrentProject } from "./local-tools-impl/__old/InsideExistingProject";
import { NewProject } from "./local-tools-impl/__old/NewProject";
import { DirectoryInfo, FileInfo } from "decova-filesystem";
import * as inquirer from "inquirer";
import { Dictionary, XString } from "decova-dotnet-developer";
import { Exception } from "decova-dotnet-developer";



import path from "path";
import { WorkspaceAugmenter as WorkspaceAugmenter } from "./local-tools-impl/Techies/DecovaSpecific/WorkspaceAugmenter";
import { List } from "decova-dotnet-developer";
import { Intellisense } from "./external-sheet/Intellisense";
import { StepType } from "./external-sheet/StepType";
import { ICmdSheet } from "./external-sheet/ICmdSheet";
import { IWalkthrough } from "./external-sheet/IWalkthrough";
import os from "os";
import { underline } from "chalk";

import { Process } from "decova-environment";
import { ExecFromSheet } from "./external-sheet/ExecFromSheet";



enum NextStepPrompt
{
    Go = 'Go',
    Skip = 'Skip',
    Abort = 'Abort'
}

export default class Main
{

    private async DoOldBranching()
    {
        let ops = {
            search: "Search",
            developCurrentProject: "Develop current project",
            developYourTools: 'Develop your tools',
            developYourPackages: 'Develop your packages',
            createProject: 'New Project',
        };

        let selected = await Terminal.McqAsync(">>:", ops);
        switch (selected)
        {
            case ops.developCurrentProject:
                await InsideCurrentProject.TakeControl();
                break;

            case ops.developYourTools:
                await DevelopMyTools.TakeControl();
                break;

            case ops.developYourPackages:
                await DevelopMyPackages.TakeControl();
                break;

            case ops.createProject:
                await NewProject.TakeControl();
                break;

            default:
                throw new Error("Unplanned execution path.");
        }
        return;
    }

    public async TakeControl()
    {
        
        if(Process.Current.Args.Any())
        {
            await new ExecFromSheet().TakeControlAsync(Process.Current.Args.First());
        }
        else
        {
            await new ExecFromSheet().TakeControlAsync(null);
        }
    }
}  