import { WalkthroughsSheet, ICmdSheet, IStep, IWalkthrough, StepType } from "./WalkthroughsSheet";

import { Dictionary, Exception, List, XString } from "decova-dotnet-developer";
import { Intellisense } from "./Intellisense";
import { TerminalAgent } from "./TerminalAgent";
import { LTool_CheckGotchaLocalRepo } from "../local-tools-impl/LTool_CheckGotchaLocalRepo";
import { LocalToolsDispatcher } from "../local-tools-impl/LocalToolsDispatcher";
import { CommonMenu } from "../local-tools-impl/Techies/CommonMenu";
import { PathMan } from "../local-tools-impl/Techies/PathMan";
require('dotenv')

export class ExecFromSheet
{
    private async HandlePromptTextAsync(prompt: IStep, vars: Dictionary<string, string>)
    {
        do
        {
            const ans = await TerminalAgent.AskForTextAsync(prompt.DisplayText);
            const hasPattern = new XString(prompt.Regex).IsNullOrWhiteSpace() == false;

            if (hasPattern)
            {
                const regex = new RegExp(prompt.Regex);
                if(regex.test(ans.trim()) == false)
                {
                    TerminalAgent.ShowError(`[${prompt.VarName}] doesn't match the pattern  ${prompt.Regex}`);
                    continue;
                }
            }
    
            vars.Ensure(prompt.VarName, ans);

        }
        while(vars.Contains(prompt.VarName) == false)
    }

    private async HandleMcqAsync(prompt: IStep, vars: Dictionary<string, string>)
    {
        const options = new List<any>(prompt.Options.map(op => { label: op }))
        const intelli = new Intellisense(options, (op) => op.label)
        const ans = await intelli.PromptAsync('>>>')

        vars.Ensure(prompt.VarName, ans)
    }



    private CompileScript(composer: string, vars: Dictionary<string, string>): string|null
    {
        let output = new XString(composer.trim());
        // console.log('vars.length = ', vars.Items.Count)
        // vars?.Items.Items.forEach(kv =>
        // {
        //     vars.Items.Items.forEach(kv => {
        //         console.log('var ', kv.Key , ' = ', kv.Value)
        //     });
        //     output = output.ReplaceAll(`<${kv.Key}>`, kv.Value);
        // });

        vars.Foreach((kv)=>
        {
            output = output.ReplaceAll(`<${kv.Key}>`, kv.Value)
        })

        try
        {
            if (output.StartsWith("("))
            {
                const func = eval(output.Value);
                if(func?.constructor != Function)
                {
                    TerminalAgent.ShowError(`Error evaluating expression: ${output.Value}`)
                    return null;
                }

                output = new XString((func as Function).call([]));
            }
        } 
        catch (err)
        {
            TerminalAgent.ShowError(`Error evaluating the command: ${output.Value}`)
            return null;
        }

        // console.log('Compiled script = ', output.Value)
        return output.Value;
    }

    public async HandleCommandAsync(command: IStep, vars: Dictionary<string, string>)
    {
       TerminalAgent.Hint(command.DisplayText)

        const output = this.CompileScript(command.Composer, vars);
        if(!output)
        {
            TerminalAgent.ShowError('Command terminated');
            return;
        }
        
        const ans = await CommonMenu.ShowContinueSkipAsync('>>>')
        if(ans)
        {
            console.log('command: ', output)
            TerminalAgent.Exec(output as string)
        }
        else
        {
            TerminalAgent.ShowError("Command skipped!")
        }
        
    }

    private async HandleInstructionAsync(instruction: IStep, vars: Dictionary<string, string>)
    {
        TerminalAgent.Hint(instruction.DisplayText)

        let output = await this.CompileScript(instruction.Composer, vars) 
        TerminalAgent.Instruct(output as string)
        
        const ans = await CommonMenu.ShowContinueSkipAsync('>>>')
        if(ans)
        {
            TerminalAgent.ShowError("Done!")
        }
        else
        {
            TerminalAgent.ShowError("Instruction skipped!")
        }
    }

    private async HanldeWalkthrough(wk: IWalkthrough)
    {
        //TerminalAgent.Hint(wk.DisplayText);
    
        const vars = new Dictionary<string, string>();
        for(let step of wk.Steps) 
        {
            if(step.IsActive == false) continue;
            if(step.RunOnlyIf)
            {
                if(!this.CompileScript(step.RunOnlyIf, vars))
                {
                    continue;
                }
            }

            switch (step.Type)
            {
                case StepType.Prompt:                 
                    if (step.Options?.length > 0)
                    {
                        await this.HandleMcqAsync(step, vars)
                    }
                    else
                    {
                        await this.HandlePromptTextAsync(step, vars)
                    }
                    break;

                case StepType.Command:
                    await this.HandleCommandAsync(step, vars)
                    break;

                case StepType.Instruction:
                    await this.HandleInstructionAsync(step, vars)
                    break;
            }
        };
    }

    public async TakeControlAsync(specificCmd: string|null)
    {
        while(WalkthroughsSheet.Exists() == false)
        {
            TerminalAgent.ShowError(`Walkthroughs sheet doesn't exist in the local repo!`)
            await LocalToolsDispatcher.RunAsync(new LTool_CheckGotchaLocalRepo())
            TerminalAgent.Hint(PathMan.GotchaLocalRepo_WalkthroughsSheet.FullName)
        }

        if(specificCmd)
        {
            specificCmd = specificCmd.toLowerCase().trim();
            const wlk = new List<IWalkthrough>(WalkthroughsSheet.Singleton!.Walkthroughs)
                            .Where(w => w.Shortcut?.trim().toLowerCase() == specificCmd)
                            .FirstOrDefault(()=>true)
            if(wlk)
            {
                await this.HanldeWalkthrough(wlk);
            }
            else
            {
                await this.TakeControlAsync(null);
            }
        }
        else
        {
            const allWks = new List<IWalkthrough>(WalkthroughsSheet.Singleton!.Walkthroughs);

            const intelli = new Intellisense<IWalkthrough>(allWks, (op) => op.DisplayText)
            let ans = await intelli.PromptAsync('>>>')
            await this.HanldeWalkthrough(ans)
        }
    }

}