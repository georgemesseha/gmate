// Find db online at
// https://cloud.mongodb.com/v2/6027652f52563e2c207313ca#metrics/replicaSet/6027667f50dca2446f8fbf4c/explorer/CommandSheet/Poyka/find
import { Dictionary, Exception, Exception_ArgumentNull, List, XString } from "decova-dotnet-developer";
import { CurrentTerminal } from "decova-terminal";
import mongoose from "mongoose";
import { Encoding, FileInfo } from "decova-filesystem";
import { Json } from 'decova-json'
import path from 'path'
import { PathMan } from "../local-tools-impl/Techies/PathMan";
import { IWalkthrough } from "./IWalkthrough";




// const uri = "mongodb+srv://aipianist:poykaIsGreat@cluster0.bdjm4.mongodb.net/GMate?retryWrites=true&w=majority";

export class WalkthroughsSheet
{
    public CreatedOn: Date = new Date();
   
    private Walkthroughs:any;

    public WalkthroughList: List<IWalkthrough>;
    private CacheWalkthroughs()
    {
        const output = new List<IWalkthrough>();
        for(let prop in this.Walkthroughs)
        {
            output.Add({... this.Walkthroughs[prop], ... {Title: prop}} as IWalkthrough)
        }
        this.WalkthroughList = output;
    }

    public static FileExists(): boolean
    {
        return PathMan.GotchaLocalRepo_WalkthroughsSheet.Exists()
    }

    private static _singleton: WalkthroughsSheet|null = null;
    
    public static get Singleton(): WalkthroughsSheet|null
    {
        if(this._singleton) return this._singleton;

        if(this.FileExists() == false) return null;

        let singletonData = Json.Load<WalkthroughsSheet>(PathMan.GotchaLocalRepo_WalkthroughsSheet.FullName);
        this._singleton = new WalkthroughsSheet()
        Object.assign(this._singleton, singletonData)   
        this._singleton.CacheWalkthroughs();

        return this._singleton;
    }
}