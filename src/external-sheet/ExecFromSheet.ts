import { WalkthroughsSheet } from "./WalkthroughsSheet";
import { StepType } from "./StepType";
import { ICmdSheet } from "./ICmdSheet";
import { IWalkthrough } from "./IWalkthrough";

import { Dictionary, Exception, List, XString } from "decova-dotnet-developer";
import { Intellisense } from "./Intellisense";
import { TerminalAgent } from "./TerminalAgent";
import { LTool_CheckGotchaLocalRepo } from "../local-tools-impl/LTool_CheckGotchaLocalRepo";
import { ILocalTool, LocalToolsDispatcher } from "../local-tools-impl/LocalToolsDispatcher";
import { CommonMenu } from "../local-tools-impl/Techies/CommonMenu";
import { PathMan } from "../local-tools-impl/Techies/PathMan";
import { Step } from "./Step";
import { IPrompt } from "./IPrompt";
import { IMcq } from "./IMcq";
import { ICommand } from "./ICommand";
import { IInstruction } from "./IInstruction";
require('dotenv')

export class ExecFromSheet
{
    private async HandlePromptTextAsync(prompt: IPrompt, vars: Dictionary<string, string>)
    {
        const varName = this.CompileScript(prompt.VarNameComposer, vars) as string
        do
        {
            const quest = this.CompileScript(prompt.QuestionComposer, vars) as string

            const ans = await TerminalAgent.AskForTextAsync(quest)
            const hasPattern = new XString(prompt.Regex).IsNullOrWhiteSpace() == false;

            if (hasPattern)
            {
                const regex = new RegExp(prompt.Regex);
                if (regex.test(ans.trim()) == false)
                {
                    TerminalAgent.ShowError(`[${varName}] doesn't match the pattern  ${prompt.Regex}`);
                    continue;
                }
            }

            vars.Ensure(varName, ans);

        }
        while (vars.Contains(varName) == false)
    }

    private async HandleMcqAsync(mcq: IMcq, vars: Dictionary<string, string>)
    {
        const plainOptions = this.CompileScript(mcq.OptionsComposer, vars) as string[]

        const options = new List<any>(plainOptions.map(op => ({ label: op })))
        const intelli = new Intellisense(options.Items, (op) => op.label)

        const question = this.CompileScript(mcq.QuestionComposer, vars) as string
        const varName = this.CompileScript(mcq.VarNameComposer, vars) as string

        TerminalAgent.ShowQuestion(question)
        const ans = await intelli.PromptAsync('>>>')

        vars.Ensure(varName, ans.label)
    }

    private CompileScript(composer: string, vars: Dictionary<string, string>): any
    {
        let output = new XString(composer.trim());

        vars.Foreach((kv) =>
        {
            output = output.ReplaceAll(`<${kv.Key}>`, `${kv.Value}`)
        })

        try
        {
            if (output.StartsWith("("))
            {
                const func = eval(output.Value);
                if (func.constructor != Function)
                {
                    TerminalAgent.ShowError(`Error evaluating expression: ${output.Value}`)
                    return null;
                }

                return (func as Function).call([]);
            }
            else
            {
                return eval(output.Value)
            }
        }
        catch (err)
        {
            TerminalAgent.ShowError(`Error evaluating expression: ${output.Value}`)
            return null;
        }
    }

    public async HandleCommandAsync(command: ICommand, vars: Dictionary<string, string>)
    {
        if (command.WillDoHintComposer)
        {
            const hint = this.CompileScript(command.WillDoHintComposer, vars)
            TerminalAgent.Hint(hint!)
        }

        const output = this.CompileScript(command.CommandComposer, vars);

        if (!output)
        {
            TerminalAgent.ShowError('Command terminated');
            return;
        }

        TerminalAgent.ShowSuccess(output)

        if (command.SkipPrompt)
        {
            TerminalAgent.Exec(output as string)
        }
        else
        {
            const ans = await CommonMenu.ShowContinueSkipAsync('>>>')
            if (ans)
            {
                TerminalAgent.Exec(output as string)
            }
            else
            {
                TerminalAgent.ShowError("Command skipped!")
            }
        }
    }

    private async HandleInstructionAsync(instruction: IInstruction, vars: Dictionary<string, string>)
    {
        let output = await this.CompileScript(instruction.InstructionComposer, vars)
        TerminalAgent.Instruct(output as string)

        const ans = await CommonMenu.ShowContinueSkipAsync('>>>')
        if (ans)
        {
            TerminalAgent.ShowSuccess("Done!")
        }
        else
        {
            TerminalAgent.ShowError("Instruction skipped!")
        }
    }

    private async HanldeWalkthrough(wk: IWalkthrough)
    {
        if (wk.IsCommentedOut) return;
        
        const vars = new Dictionary<string, string>();

        for (let step of wk.Steps) 
        {
            if (step.RunOnlyIfComposer)
            {
                const condition = this.CompileScript(step.RunOnlyIfComposer, vars);
                if (!condition)
                {
                    continue;
                }
            }
            
            if(step.Command)
            {
                await this.HandleCommandAsync(step.Command!, vars)
            }
            else if(step.Instruction)
            {
                await this.HandleInstructionAsync(step.Instruction!, vars)
            }
            else if(step.Mcq)
            {
                await this.HandleMcqAsync(step.Mcq!, vars)
            }
            else if(step.Prompt)
            {
                await this.HandlePromptTextAsync(step.Prompt!, vars)
            }
        };
    }

    private WalkthroughFromLocalTool(localTool: ILocalTool): IWalkthrough
    {
        return {
            Title: `Gotcha >> Local Tool >> {g ${localTool.GetShortcut()}} ${localTool.GetHint()}`,
            IsCommentedOut: false,
            Steps: [
                {
                    Command: {
                        CommandComposer: `'g ${localTool.GetShortcut()}'`,
                        WillDoHintComposer: `'>>>'`,
                        SkipPrompt: false
                    },
                    Instruction: undefined,
                    Mcq: undefined,
                    Prompt: undefined,
                    Repeater: undefined,
                    RunOnlyIfComposer: undefined,
                    Type: StepType.Command,
                }
            ]
        }
    }

    public async TakeControlAsync(specificCmd: string | null)
    {
        while (WalkthroughsSheet.FileExists() == false)
        {
            TerminalAgent.ShowError(`Walkthroughs sheet doesn't exist in the local repo!`)
            await LocalToolsDispatcher.RunAsync(new LTool_CheckGotchaLocalRepo())
            TerminalAgent.Hint(PathMan.GotchaLocalRepo_WalkthroughsSheet.FullName)
        }

        let allWks = WalkthroughsSheet.Singleton!.WalkthroughList;

        const localToolsAsWalkthroughs = LocalToolsDispatcher.Singleton.RegisteredTools.Select(this.WalkthroughFromLocalTool);
        try
        {
            allWks.AddRange(localToolsAsWalkthroughs);
        } 
        catch (err)
        {
            console.log(err)
        }
        allWks = allWks.Sort(w => w.Title);

        const intelli = new Intellisense<IWalkthrough>(allWks, (op) => op.Title)
        let ans = await intelli.PromptAsync('>>>')
        await this.HanldeWalkthrough(ans)
        // }
    }

}