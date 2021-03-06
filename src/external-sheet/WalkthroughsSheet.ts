// Find db online at
// https://cloud.mongodb.com/v2/6027652f52563e2c207313ca#metrics/replicaSet/6027667f50dca2446f8fbf4c/explorer/CommandSheet/Poyka/find
import { Exception, Exception_ArgumentNull, List, XString } from "decova-dotnet-developer";
import { CurrentTerminal } from "decova-terminal";
import mongoose from "mongoose";
import { Encoding, FileInfo } from "decova-filesystem";
import { Json } from 'decova-json'
import path from 'path'
import { PathMan } from "../local-tools-impl/Techies/PathMan";



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
    
}
export interface ICmdSheet
{
   
}
export enum InstructionType
{
    Command,
    Instruction,
    Prompt
}


export interface IWalkthrough
{
    IsActive: boolean;
    DisplayText: string;
    Shortcut: string;
    Steps: IStep[];

}

export class WalkthroughsSheet
{
    public CreatedOn: Date = new Date();
    public Walkthroughs: IWalkthrough[] = [];
    
    public static Exists(): boolean
    {
        return PathMan.GotchaLocalRepo_WalkthroughsSheet.Exists()
    }

    private static _singleton: WalkthroughsSheet;
    
    public static get Singleton(): WalkthroughsSheet|null
    {
        if(this.Exists() == false) return null;

        if(!this._singleton)
        {
            this._singleton = Json.Load<WalkthroughsSheet>(PathMan.GotchaLocalRepo_WalkthroughsSheet.FullName);
        }
        
        return this._singleton;
    }

    // private static async LoadSheetAsync(forceRedownload: boolean)
    // {
        

    //     if (WalkthroughsSheet.IsCached == false || forceRedownload)
    //     {
    //         const sheetUrl = `https://raw.githubusercontent.com/georgemesseha/gmate/master/src/gmate-commands-sheet.json`;
    //         await FileInfo.DownloadAsync(sheetUrl, this.LocalCacheFile.FullName);
    //     }

    //     const sheetContent = this.LocalCacheFile.ReadAllText(Encoding.utf8)
    //     this._sheet = Json.Parse<ICmdSheet>(sheetContent)
    // }

    public static TryGetWalkthrough(shortcut: string): IWalkthrough | null
    {
        if (new XString(shortcut).IsNullOrWhiteSpace()) throw new Exception_ArgumentNull('shortcut');

        if(this.Singleton == null) 
            throw new Exception(`WalkthroughsSheet should be ensured existing before calling TryGetWalkthrough()`);

        shortcut = shortcut.toLowerCase();
        return new List<IWalkthrough>(this.Singleton.Walkthroughs).FirstOrDefault(w => w.Shortcut?.toLowerCase() == shortcut);
    }
}