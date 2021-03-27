import { Exception_UnintendedExecutionPath } from "decova-dotnet-developer";
import { StepType } from "./StepType";
import { ICommand } from "./ICommand";
import { IPrompt } from "./IPrompt";
import { IInstruction } from "./IInstruction";
import { IMcq } from "./IMcq";
import { IRepeater } from "./IRepeater";
import { IAggregator } from "./IAggregator";


export interface IStep
{
    RunOnlyIfComposer: string|undefined;
    Command: ICommand|undefined;
    Prompt: IPrompt|undefined;
    Instruction: IInstruction|undefined;
    Repeater: IRepeater|undefined;
    Aggregator: IAggregator|undefined;
    Mcq: IMcq|undefined;
}
