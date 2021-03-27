import { Step } from "./Step";



export interface IWalkthrough
{
    Title: string
    IsCommentedOut: boolean;
    Steps: Step[];
}
