// Find db online at
// https://cloud.mongodb.com/v2/6027652f52563e2c207313ca#metrics/replicaSet/6027667f50dca2446f8fbf4c/explorer/CommandSheet/Poyka/find
import { List } from "decova-dotnet-developer";
import { CurrentTerminal } from "decova-terminal";
import mongoose from "mongoose";
import { FileInfo } from "decova-filesystem";
import { Json } from 'decova-json'
import path from 'path'



const uri = "mongodb+srv://aipianist:poykaIsGreat@cluster0.bdjm4.mongodb.net/GMate?retryWrites=true&w=majority";

export enum StepType
{
    Command = "Command",
    Prompt = "Prompt",
    Instruction = "Instruction" 
}
export interface IStep
{
    IsActive: boolean;
    RunOnlyIf: string;
    Type: StepType,
    VarName: string,
    DisplayText: string,
    Regex: string,
    Options: string[],
    Composer: string
}
export interface IWalkthrough
{
    IsActive: boolean,
    DisplayText: string,
    Steps: IStep[];
}
export interface ICmdSheet
{
    CreatedOn: Date,
    Walkthroughs: IWalkthrough[]
}
export enum InstructionType
{
    Command,
    Instruction,
    Prompt
}


export class DB
{
    private static get LocalCacheFile(): FileInfo
    {
       return new FileInfo(path.join(__dirname, 'command-sheet.json'));
    }

    public static get IsCached():boolean
    {
        return this.LocalCacheFile.Exists();
    }

    public static async GetSheetAsync(forceRedownload: boolean): Promise<ICmdSheet>
    {
        if(DB.IsCached == false || forceRedownload)
        {
            const sheetUrl = `https://raw.githubusercontent.com/georgemesseha/gmate/master/src/gmate-commands-sheet.json`;
            await FileInfo.DownloadAsync(sheetUrl, this.LocalCacheFile.FullName);
        }

        const sheetContent = this.LocalCacheFile.ReadAllText();
        return Json.Parse<ICmdSheet>(sheetContent)
    } 
}