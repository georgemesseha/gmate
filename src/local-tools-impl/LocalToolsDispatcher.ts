import { Dictionary, Exception, List } from "decova-dotnet-developer";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { LTool_EditSnippets } from "./LTool_EditAugmenterFile";
import { LTool_IncrementPatch } from "./LTool_IncrementPatch";
import { CommonMenu } from "./Techies/CommonMenu";


export interface ILocalTool
{
    TakeControlAsync(args: string): Promise<void>;

    GetHint(): string;

    GetShortcut(): string;
}

export class LocalToolsDispatcher
{
    private static _singleton: LocalToolsDispatcher;
    public static get Singleton(): LocalToolsDispatcher
    {
        if(this._singleton == null)
        {
            this._singleton = new LocalToolsDispatcher()
        }
        return this._singleton;
    }

    constructor()
    {
        if(LocalToolsDispatcher._singleton) throw new Exception('Only one instance of LocalToolsDispatcher is expected to be initialzed on the app lifetime')
        LocalToolsDispatcher._singleton = this;
    }

    private _local_tools_dictionary: Dictionary<string, ILocalTool> = 
    new Dictionary<string, ILocalTool>();

    public RegisterLocalTools( ... localTools: ILocalTool[])
    {
        localTools.forEach(tool => 
            {
                const shortcut = tool.GetShortcut().trim().toLowerCase();
                // #region ensure local tools dictionary
                if(this._local_tools_dictionary == null)
                {
                    this._local_tools_dictionary = new Dictionary<string, ILocalTool>();
                }
                // #endregion
            
                // #region ensure unique shortcut
                if(this._local_tools_dictionary.Contains(shortcut))
                    throw new Exception(`Local tool shortcut ${shortcut} is already registered!`);
                // #endregion
            
                this._local_tools_dictionary.Add(shortcut, tool);
            })
    }

    public async TryAimTool(shortcut: string, args: string): Promise<boolean>
    {
        if(this._local_tools_dictionary.Contains(shortcut) == false)
        {
            return false;
        }
        else
        {
            const tool = this._local_tools_dictionary.Get(shortcut);
            await tool!.TakeControlAsync(args);
            return true;
        }
    }

    public static async RunAsync(lTool: ILocalTool, args?: string)
    {
        TerminalAgent.Hint(lTool.GetHint());

        const ans = await CommonMenu.ShowContinueSkipAsync('>>>')
        if(ans)
        {
            const cmd: string = `ggg ${lTool.GetShortcut()}`
            console.log('command: ', cmd)
            TerminalAgent.Exec(cmd)
        }
        else
        {
            TerminalAgent.ShowError("Command skipped!")
        }
    }

    public get RegisteredTools(): List<ILocalTool>
    {
        return this._local_tools_dictionary.Values;
    }
}