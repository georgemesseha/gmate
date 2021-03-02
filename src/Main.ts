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
import { Exception } from "decova-dotnet-developer";



import path from "path";
import { WorkspaceAugmenter as WorkspaceAugmenter } from "./WorkspaceAugmenter";
import { List } from "decova-dotnet-developer";
import { Intellisense } from "./Intellisense";
import { DB, ICmdSheet, InstructionType, IStep, IWalkthrough, StepType } from "./DB";
import os from "os";
import { underline } from "chalk";



enum NextStepPrompt
{
    Go = 'Go',
    Skip = 'Skip',
    Abort = 'Abort'
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

        if (hasPattern && pattern.test(ans.trim()) == false)
        {
            await Terminal.DisplayErrorAsync(`[${prompt.VarName}] doesn't match the pattern /${prompt.Regex}/g!`);
            await this.HandlePromptText(prompt, vars);
        }

        vars.Ensure(prompt.VarName, ans);
    }

    private async HandleMcq(prompt: IStep, vars: Dictionary<string, string>)
    {
        const options = new List<any>(prompt.Options.map(op => { label: op }))
        const intelli = new Intellisense(options, (op) => op.label)
        const ans = await intelli.Prompt()

        vars.Ensure(prompt.VarName, ans)
    }

    private async ShowContinueSkip(): Promise<boolean>
    {
        const options = new List<any>(['Continue', 'Skip'])
        const intelli = new Intellisense(options, (op) => op)
        const ans = await intelli.Prompt();

        switch(ans)
        {
            case 'Continue':
                return true;
            case 'Skip':
            default:
                return false;
        }
    }


    private async CompileScript(composer: string, vars: Dictionary<string, string>): Promise<string>
    {
        let output = new XString(composer.trim());
        vars?.Items.Items.forEach(kv =>
        {
            output = output.ReplaceAll(`<<${kv.Key}>>`, kv.Value);
        });

        try
        {
            if (output.StartsWith("("))
            {
                const func = eval(output.Value);
                if(func?.constructor != Function)
                {
                    throw new Exception(`The provided script cannot be compiled [${composer}]`)
                }

                output = (func as Function)();
            }
        } 
        catch (err)
        {
            throw new Exception(`The provided composer execution raised an exception: [${composer}]`, new Exception(err));
        }

        return output.Value;
    }

    private async HandleCommand(command: IStep, vars: Dictionary<string, string>)
    {
        await Terminal.InstructAsync(command.DisplayText, undefined)

        const output = await this.CompileScript(command.Composer, vars);
        const ans = await this.ShowContinueSkip()

        if(ans)
        {
            Terminal.Exec(output)
        }
        else
        {
            await Terminal.DisplayErrorAsync("Command skipped!")
        }
    }

    private async HandleInstruction(instruction: IStep, vars: Dictionary<string, string>)
    {
        await Terminal.InstructAsync(instruction.DisplayText, undefined)

        let output = await this.CompileScript(instruction.Composer, vars) 
        await Terminal.InstructAsync(output, undefined)
        
        const ans = await this.ShowContinueSkip()
        if(ans)
        {
            await Terminal.DisplayErrorAsync("Done!")
        }
        else
        {
            await Terminal.DisplayErrorAsync("Instruction skipped!")
        }
    }

    private async HanldeWalkthrough(wk: IWalkthrough)
    {
        Terminal.DisplayInfo(wk.DisplayText);
        const vars = new Dictionary<string, string>();

        for(let step of wk.Steps) 
        {
            if(step.IsActive == false) continue;
            if(step.RunOnlyIf)
            {

            }

            switch (step.Type)
            {
                case StepType.Prompt:
                    
                    if (step.Options?.length > 0)
                    {
                        this.HandleMcq(step, vars)
                    }
                    else
                    {
                        this.HandlePromptText(step, vars)
                    }
                    break;

                case StepType.Command:
                    this.HandleCommand(step, vars)
                    break;

                case StepType.Instruction:
                    this.HandleInstruction(step, vars)
                    break;
            }
        };
    }

    private _sheet: ICmdSheet | null = null;

    public async TakeControl()
    {
        await DB.GetSheetAsync(false);

        const allWks = new List<IWalkthrough>(this._sheet?.Walkthroughs);

        const intelli = new Intellisense<IWalkthrough>(allWks, (op) => op.DisplayText)
        let ans = await intelli.Prompt()
        await this.HanldeWalkthrough(ans)
    }
}  