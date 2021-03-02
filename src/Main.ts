//import ch from "chalk";
// import figlet from "figlet";
//import * as cp from "child_process"
import { CurrentTerminal as Terminal } from "decova-terminal";
import { DevelopMyPackages } from "./DevelopMyPackages";
import { DevelopMyTools } from "./DevelopMyTools";
import { InsideExistingProject as InsideCurrentProject } from "./InsideExistingProject";
import { NewProject } from "./NewProject";
import { DirectoryInfo, FileInfo } from "decova-filesystem";
import * as inquirer from "inquirer";
import { Dictionary, XString } from "decova-dotnet-developer";



import path from "path";
import { WorkspaceAugmenter as WorkspaceAugmenter } from "./WorkspaceAugmenter";
import { List } from "decova-dotnet-developer";
import { Intellisense } from "./Intellisense";
import { DB, ICmdSheet, InstructionType, IStep, IWalkthrough, StepType } from "./DB";
import os from "os";



enum NextStepPrompt
{
    Go='Go',
    Skip='Skip',
    Abort='Abort'
}

export default class Main
{
    private _allWalkthroughs: List<IWalkthrough> = new List<IWalkthrough>();

    private DisplayCurrentDirectory()
    {
        console.log('........................................');
        console.log('@' + DirectoryInfo.Current.FullName);
        console.log('........................................');
    }

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

    private async HandlePromptText(prompt: IStep, vars: Dictionary<string, string>)
    {
        const ans = await Terminal.AskForTextAsync(prompt.DisplayText);
        
        const hasPattern = new XString(ans).IsNullOrWhiteSpace() == false;
        const pattern = new RegExp(ans);

        if(hasPattern && pattern.test(ans.trim()) == false)
        {
            await Terminal.DisplayErrorAsync(`[${prompt.VarName}] doesn't match the pattern /${prompt.Regex}/g!`);
            await this.HandlePromptText(prompt, vars);
        }
        
        vars.Ensure(prompt.VarName, ans);
    }

    private async HandleMcq(prompt: IStep)
    {
        
    }

    private async HanldeWalkthrough(wk: IWalkthrough): Promise<NextStepPrompt>
    {
        Terminal.DisplayInfo(wk.DisplayText);
        wk.Steps.forEach(step => 
        {
            const vars = new Dictionary<string, string>();
            switch(step.Type)
            {
                case StepType.Command:
                    break;
                case StepType.Mcq:
                    break;
                case StepType.Prompt_Boolean:
                    break;
                case StepType.Prompt_Number:
                    break;
                case StepType.Prompt_Text:
                    break;
            }
            Terminal.DisplayInfo(step.DisplayText);
            Terminal.DisplayInfo(step.DisplayText);
        });

        
       
        let op = await Terminal.McqAsync('Ready?', NextStepPrompt);
        switch(op)
        {
            case NextStepPrompt.Go:
                switch(wk.Type)
                {
                    case InstructionType.Instruction:
                        await Terminal.InstructAsync(wk.CliCommand);
                        break;
                    
                    case InstructionType.Command:
                    default:
                        Terminal.Exec(wk.CliCommand);
                        break;
                }
                break;
 
            case NextStepPrompt.Skip:
                Terminal.DisplayErrorAsync('---- Skipped ----');
                break;

            default:
                Terminal.DisplayErrorAsync('---- Aborted ----');
                return op;
        }

        return op;
    }

    private _sheet: ICmdSheet|null = null;

    public async TakeControl()
    {
       await DB.GetSheetAsync(false);

       const allWks = new List<IWalkthrough>(this._sheet?.Walkthroughs);

       const intelli = new Intellisense<IWalkthrough>(allWks, (op)=>op.DisplayText)
       let ans = await intelli.Prompt()
       await this.HanldeWalkthrough(ans)
    }
}  