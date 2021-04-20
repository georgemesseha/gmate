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
import { IStep } from "./Step";
import { IPrompt } from "./IPrompt";
import { IMcq } from "./IMcq";
import { ICommand } from "./ICommand";
import { IInstruction } from "./IInstruction";
import { IRepeater } from "./IRepeater";
import { IAggregator } from "./IAggregator";
import { _AllowStringsForIds } from "mongoose";
import { Terminal } from "../Hub";

export class ExecFromSheet
{
    private async HandlePromptTextAsync(prompt: IPrompt, vars: Dictionary<string, string>)
    {
        if(!prompt) TerminalAgent.ShowError(`prompt argument cannot be null 8912`) 
        if(!vars) TerminalAgent.ShowError(`vars argument cannot be null`)

        
        if(!prompt.VarNameComposer) TerminalAgent.ShowError(`prompt.VarNameComposer cannot be null 216654`)

        
        const varName = this.CompileScript(prompt.VarNameComposer, vars) as string

        if(!varName) 
        {
            
        }

        do
        {
            
            const quest = this.CompileScript(prompt.QuestionComposer, vars) as string
            const ans = await TerminalAgent.AskForTextAsync(quest)

            
            // console.log('just before use of string ext .IsWhiteSpace')
            // const hasPattern = !prompt.Regex?.IsWhiteSpace() ?? false;
            const hasPattern = new XString(prompt.Regex).IsNullOrWhiteSpace() == false
            // console.log('just after use of string ext .IsWhiteSpace', 'has pattern = ', hasPattern)

            if (hasPattern)
            {
                const regex = new RegExp(prompt.Regex);
                if (regex.test(ans.trim()) == false)
                {
                    TerminalAgent.ShowError(`[${varName}] doesn't match the pattern ${prompt.Regex}`);
                    continue;
                }
            }

            vars.Ensure(varName, ans, true);
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

        vars.Ensure(varName, ans.label, true)
    }

    private CompileScript(composer: string, vars: Dictionary<string, string>): any
    {
        let output = composer;

        vars.Foreach((kv) =>
        {
            output = output.xReplaceAll(`<${kv.Key}>`, `${kv.Value}`)
        })

        try
        {
            if (output.xStartsWith("("))
            {
                const func = eval(output);
                if (func.constructor != Function)
                {
                    TerminalAgent.ShowError(`Error evaluating expression: ${output} 98513`)
                    return null;
                }
                return (func as Function).call([]);
            }
            else
            {
                if(output == null || output == '')
                {
                    TerminalAgent.ShowError(`Expression (${composer}) was evaluated to null or empty 24165489`)
                    throw `Error evaluating expression: ${output}`;
                }
                return eval(output);
            }
        }
        catch (err)
        {
            TerminalAgent.ShowError(`Error evaluating expression: ${output} 12468;\r\n ${err}`)
            throw `Error evaluating expression: ${output}`;
        }
    }

    private _currentAggregation: string[] | null = null;

    private async HandleAggregatorAsync(aggregator: IAggregator, vars: Dictionary<string, string>)
    {
        this._currentAggregation = [];
        for (let step of aggregator.Steps)
        {
            await this.HandleStep(step, vars)
        }

        const finalCommand = this._currentAggregation.join('')
        vars.Add(aggregator.OutputVarName, finalCommand)

        this._currentAggregation = null;
    }

    private async HandleRepeaterAsync(repeater: IRepeater, vars: Dictionary<string, string>)
    {
        while (true)
        {
            const doRepeat = await TerminalAgent.YesNoQuestionAsync(repeater.DoRepeatQuestionComposer)

            if (!doRepeat)
            {
                break;
            }

            for (let step of repeater.IterationSteps)
            {
                await this.HandleStep(step, vars)
            } 
        }
    }

    public async HandleCommandAsync(command: ICommand, vars: Dictionary<string, string>)
    {
        const hintIsApplicable = this._currentAggregation == null && command.WillDoHintComposer
       
        // #region display hint if applicable
        if (hintIsApplicable)
        {
            const hint = this.CompileScript(command.WillDoHintComposer, vars)
            TerminalAgent.Hint(hint!)
        }
        // #endregion

        // #region compile and display command
        const output = this.CompileScript(command.CommandComposer, vars);
        TerminalAgent.ShowSuccess(output)
        // #endregion

        // #region if inside an Aggregator just accumulate, don't execute
        if (this._currentAggregation != null)
        {
            this._currentAggregation.push(output as string);
        }
        // #endregion

        // #region else if SkipPrompt just execute immediately
        else if (command.SkipPrompt)
        {
            TerminalAgent.Exec(output as string)
        }
        // #endregion

        // #region else, prompt to execute
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
        // #endregion   
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

    private async HandleStep(step: IStep, vars: Dictionary<string, string>)
    {
        if(!step) throw 'step argument cannot be null'
        if(!vars) throw 'vars argument cannot be null'

        if (step.RunOnlyIfComposer)
        {
            const condition = this.CompileScript(step.RunOnlyIfComposer, vars);
            if (!condition)
            {
                return;
            }
        }

        if (step.Command)
        {
            await this.HandleCommandAsync(step.Command!, vars)
        }
        else if (step.Instruction)
        {
            await this.HandleInstructionAsync(step.Instruction!, vars)
        }
        else if (step.Mcq)
        {
            await this.HandleMcqAsync(step.Mcq!, vars)
        }
        else if (step.Prompt)
        {
            await this.HandlePromptTextAsync(step.Prompt!, vars)
        }
        else if (step.Repeater)
        {
            await this.HandleRepeaterAsync(step.Repeater, vars)
        }
        else if (step.Aggregator)
        {
            await this.HandleAggregatorAsync(step.Aggregator, vars)
        }
    }

    private async HanldeWalkthrough(wk: IWalkthrough)
    {
        if(!wk) TerminalAgent.ShowError(`wk must be a non-null IWalkthrough`)
        
        if (wk.IsCommentedOut) return;

        const vars = new Dictionary<string, string>();

        for (let step of wk.Steps) 
        {     
            await this.HandleStep(step, vars);
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
                    Aggregator: undefined,
                }
            ],
            Shortcut: undefined
        }
    }

    public async TakeControlAsync(shortcut: string|null)
    {
        // #region load sheet's walkthroughs
        while (WalkthroughsSheet.FileExists() == false)
        {
            TerminalAgent.ShowError(`Walkthroughs sheet doesn't exist in the local repo!`)
            await LocalToolsDispatcher.RunAsync(new LTool_CheckGotchaLocalRepo())
            TerminalAgent.Hint(PathMan.GotchaLocalRepo_WalkthroughsSheet.FullName)
        }

        let allWks = WalkthroughsSheet.Singleton!.WalkthroughList;
        // #endregion
        
        // #region create walkthroughs from local tools to include them in all walkthroughs
        const localToolsAsWalkthroughs = LocalToolsDispatcher.Singleton.RegisteredTools.Select(this.WalkthroughFromLocalTool);
        try
        {
            allWks.AddRange(localToolsAsWalkthroughs);
        }
        catch (err)
        {
            console.log(err)
        }
        // #endregion

        // #region sort walkthroughs
        allWks = allWks.Sort(w => w.Title);
        // #endregion

        // #region find and handle a walkthrough
        if(shortcut) 
        {
            await this.HandleWalkthroughOfShortcut(allWks, shortcut);
        }
        else
        {
            await this.PromptUserToPickAndRunWalkthrough(allWks);
        }
        // #endregion
    }

    private async HandleWalkthroughOfShortcut(allWks: List<IWalkthrough>, shortcut: string)
    {
        const wk = allWks.FirstOrDefault(wk => wk.Shortcut?.toLowerCase() == shortcut.toLowerCase())
        if(!wk)
        {
            Terminal.DisplayErrorAsync(`The shortcut [${shortcut}] wasn't recognized by Gotcha!`)
        }
        else
        {
            await this.HanldeWalkthrough(wk);
        }
    }

    private async PromptUserToPickAndRunWalkthrough(allWks: List<IWalkthrough>)
    {
        const intelli = new Intellisense<IWalkthrough>(allWks, (op) => op.Title)
        let ans = await intelli.PromptAsync('>>>')
        await this.HanldeWalkthrough(ans)
    }

}