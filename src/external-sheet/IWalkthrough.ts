import { IStep } from "./Step";



export interface IWalkthrough
{
    Title: string
    IsCommentedOut: boolean;
    Steps: IStep[];
    Shortcut: string|undefined;
}
