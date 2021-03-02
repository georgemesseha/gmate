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
import { XString } from "decova-dotnet-developer";



import path from "path";
import { WorkspaceAugmenter as WorkspaceAugmenter } from "./WorkspaceAugmenter";
import { List } from "decova-dotnet-developer";
import { Intellisense } from "./Intellisense";
import { DB, InstructionType } from "./DB";
import os from "os";



enum NextStepPrompt
{
    Go='Go',
    Skip='Skip',
    Abort='Abort'
}

export interface IInstruction
{
    Command: string,
    WillDo: string,
    Type: InstructionType,
}

export interface IBatch
{
    Description: string;
    Commands: IInstruction[];
}

export interface ICmdSheet
{
    CreateOn: string;
    Batches: IBatch[];
}

export default class Main
{
    private _allOptions: List<IInstruction> = new List<IInstruction>();

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

    private get LocalCommandsFile(): FileInfo
    {
       return new FileInfo(path.join(__dirname, 'command-sheet.json'));
    }

    private async ReloadCommands(forceDownload:boolean=false)
    {
        this._allOptions.Add({Id:-1, Type: InstructionType.Command, CliCommand: '', Description: '>> Reload commands'})
        this._allOptions.Add({Id:-2, Type: InstructionType.Command, CliCommand: '', Description: '>> Open old Poyka tree'})
    
        let onlineOnes:List<IInstruction>;
        if(this.LocalCommandsFile.Exists() == false || forceDownload)
        {
            const  = await (await DB.GetAllCommands()).First() as ICmdSheet;
            const content = JSON.stringify(onlineOnes);
            this.LocalCommandsFile.WriteAllText(content);
        }
        else
        {
            this.LocalCommandsFile.ReadAllText()
        }
        
        this._allOptions.AddRange(onlineOnes);
    }

    private async HanldeCommandBatch(cmd: IInstruction): Promise<NextStepPrompt>
    {
        Terminal.DisplayInfo(cmd.Description);
        Terminal.DisplayInfo(cmd.CliCommand);
       
        let op = await Terminal.McqAsync('Ready?', NextStepPrompt);
        switch(op)
        {
            case NextStepPrompt.Go:
                switch(cmd.Type)
                {
                    case InstructionType.Instruction:
                        await Terminal.InstructAsync(cmd.CliCommand);
                        break;
                    
                    case InstructionType.Command:
                    default:
                        Terminal.Exec(cmd.CliCommand);
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

    public async TakeControl()
    {
       // #region startup
       this.DisplayCurrentDirectory();
       if(this._allOptions.Count == 0)
       {
           await this.ReloadCommands();
       }
       // #endregion

       // #region prompt
       const intelli = new Intellisense<IInstruction>(this._allOptions, (op)=>op.Description)
       let ans = await intelli.Prompt()
       // #endregion

       switch(ans.Id)
       {
           case -2:
               await this.DoOldBranching();
               break;

            case -1:
                await this.ReloadCommands();
                await this.TakeControl();
                break;

            default:
                await this.HanldeCommandBatch(ans);
                break;
       }
    }
}  