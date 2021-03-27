import { Exception_UnintendedExecutionPath } from "decova-dotnet-developer";
import { StepType } from "./StepType";
import { ICommand } from "./ICommand";
import { IPrompt } from "./IPrompt";
import { IInstruction } from "./IInstruction";
import { IMcq } from "./IMcq";
import { IRepeater } from "./IRepeater";


export class Step
{
    get Type(): StepType
    {
        console.log('****************** this.Command = ', this.Command)
        if (this.Command)
            return StepType.Command;
        if (this.Prompt)
            return StepType.Prompt;
        if (this.Mcq)
            return StepType.Mcq;
        if (this.Repeater)
            return StepType.Repeater;
        if (this.Instruction)
            return StepType.Instruction;
        else
            throw new Exception_UnintendedExecutionPath("");
    }
    RunOnlyIfComposer: string|undefined;
    Command: ICommand|undefined;
    Prompt: IPrompt|undefined;
    Instruction: IInstruction|undefined;
    Repeater: IRepeater|undefined;
    Mcq: IMcq|undefined;
}
