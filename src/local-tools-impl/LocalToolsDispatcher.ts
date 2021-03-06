import { Dictionary, Exception } from "decova-dotnet-developer";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
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
            TerminalAgent.Hint(tool!.GetHint());
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


}