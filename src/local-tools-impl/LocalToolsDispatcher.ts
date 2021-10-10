import { Exception } from "decova-dotnet";
import { singleton } from "tsyringe";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { LTool_EditSnippets } from "./LTool_EditAugmenterFile";
import { LTool_IncrementPatch } from "./LTool_IncrementPatch";
import { AbstractLocalTool } from "./Techies/AbstractLocalTool";
import { CommonMenu } from "./Techies/CommonMenu";


// export interface ILocalTool
// {
//     TakeControlAsync(args: string): Promise<void>;

//     GetHint(): string;

//     GetShortcut(): string;
// }

@singleton()
export class LocalToolsDispatcher
{
    private static _singleton: LocalToolsDispatcher;
    // public static get Singleton(): LocalToolsDispatcher
    // {
    //     if(this._singleton == null)
    //     {
    //         this._singleton = new LocalToolsDispatcher()
    //     }
    //     return this._singleton;
    // }

    constructor()
    {
        if(LocalToolsDispatcher._singleton) throw new Exception('Only one instance of LocalToolsDispatcher is expected to be initialzed on the app lifetime')
        LocalToolsDispatcher._singleton = this;
    }

    private _local_tools_dictionary: Map<string, AbstractLocalTool> = 
    new Map<string, AbstractLocalTool>();

    public RegisterLocalTools( ... localTools: AbstractLocalTool[])
    {
        localTools.forEach(tool => 
            {
                const shortcut = tool.GetShortcut().trim().toLowerCase();
                // #region ensure local tools dictionary
                if(this._local_tools_dictionary == null)
                {
                    this._local_tools_dictionary = new Map<string, AbstractLocalTool>();
                }
                // #endregion
            
                // #region ensure unique shortcut
                if(this._local_tools_dictionary.xContains(shortcut))
                    throw new Exception(`Local tool shortcut ${shortcut} is already registered!`);
                // #endregion
            
                this._local_tools_dictionary.xAdd(shortcut, tool);
            })
    }

    public async TryAimTool(shortcut: string, args: string): Promise<boolean>
    {
        if(this._local_tools_dictionary.xContains(shortcut) == false)
        {
            return false;
        }
        else
        {
            const tool = this._local_tools_dictionary.xGet(shortcut);
            await tool!.TakeControlAsync(args);
            return true;
        }
    }

    public static async RunAsync(lTool: AbstractLocalTool, args?: string)
    {
        TerminalAgent.Hint(lTool.GetHint());

        const ans = await CommonMenu.ShowContinueSkipAsync('>>>')
        if(ans)
        {
            const cmd: string = `g ${lTool.GetShortcut()}`
            console.log('command: ', cmd)
            TerminalAgent.Exec(cmd)
        }
        else
        {
            TerminalAgent.ShowError("Command skipped!")
        }
    }

    public get RegisteredTools(): AbstractLocalTool[]
    {
        return this._local_tools_dictionary.xValues();
    }
}