// Find db online at
// https://cloud.mongodb.com/v2/6027652f52563e2c207313ca#metrics/replicaSet/6027667f50dca2446f8fbf4c/explorer/CommandSheet/Poyka/find
import { CurrentTerminal } from "decova-terminal";
import mongoose from "mongoose";
import { Encoding, FileInfo } from "decova-filesystem";
import { Json } from 'decova-json'
import path from 'path'
import { PathMan } from "../local-tools-impl/Techies/PathMan";
import { IWalkthrough } from "./IWalkthrough";
import { TerminalAgent } from "./TerminalAgent";
import { container } from "tsyringe";

// const uri = "mongodb+srv://aipianist:poykaIsGreat@cluster0.bdjm4.mongodb.net/GMate?retryWrites=true&w=majority";

export class WalkthroughsSheet
{
    private readonly srv_PathMan = container.resolve(PathMan);

    public CreatedOn: Date = new Date();

    private Walkthroughs: any;

    public WalkthroughList: IWalkthrough[];
    private CacheWalkthroughs()
    {
        const output: IWalkthrough[] = [];
        for (let prop in this.Walkthroughs)
        {
            output.xAdd({ ... this.Walkthroughs[prop], ... { Title: prop } } as IWalkthrough)
        }
        this.WalkthroughList = output;
    }

    public FileExists(): boolean
    {
        return this.srv_PathMan.GotchaLocalRepo_WalkthroughsSheet.Exists()
    }

    private static _singleton: WalkthroughsSheet | null = null;

    public static get Singleton(): WalkthroughsSheet | null
    {
        if (this._singleton) return this._singleton;

        const pathMan = container.resolve(PathMan); 
        if (pathMan.GotchaLocalRepo_WalkthroughsSheet.Exists() == false) return null;

        let singletonData: WalkthroughsSheet;

        try
        {
            singletonData = Json.Load<WalkthroughsSheet>(pathMan.GotchaLocalRepo_WalkthroughsSheet.FullName);
        } 
        catch (err)
        {
            TerminalAgent.ShowError(`Couldn't load Walkthroughs sheet \r\n ${JSON.stringify(err)}`)
            throw {
                error: `Couldn't load Walkthroughs sheet`,
                innerException: JSON.stringify(err) 
            }
        }

        this._singleton = new WalkthroughsSheet()
        Object.assign(this._singleton, singletonData)
        this._singleton.CacheWalkthroughs();

        return this._singleton;
    }
}