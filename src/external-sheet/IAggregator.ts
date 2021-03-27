import { IStep } from "./Step";


export interface IAggregator
{
    Steps: IStep[]
    OutputVarName: string
}
