
import chalk from "chalk";
import { Process } from "decova-environment";

import figlet from "figlet";
import { ExecFromSheet } from "./external-sheet/ExecFromSheet";
import Main from './Main'
import { QuickCommands } from "./local-tools-impl/__old/QuickCommands";
import { WorkspaceAugmenter } from "./local-tools-impl/Techies/DecovaSpecific/WorkspaceAugmenter";
import { LocalToolsDispatcher } from "./local-tools-impl/LocalToolsDispatcher";
import { KeyValuePair, XString } from "decova-dotnet-developer";
import { LTool_IncrementPatch } from "./local-tools-impl/LTool_IncrementPatch";
import { DirectoryInfo } from "decova-filesystem";
import { LTool_CheckGotchaLocalRepo } from "./local-tools-impl/LTool_CheckGotchaLocalRepo";
import { LTool_EditWalkthroughs, LTool_EditSnippets, LTool_EditLaunchFile } from "./local-tools-impl/LTool_EditAugmenterFile";




const pjson = require('../package.json');

export class App
{
    private ShowStartupInfo()
    {
        console.log
            (
                chalk.cyanBright
                    (
                        figlet.textSync("Gtch`", { horizontalLayout: "default" })
                    )
            );
        console.log(pjson.version);
        console.log(`PID: ${process.pid}`)
        console.log('........................................');
        console.log('@' + DirectoryInfo.Current.FullName);
        console.log('........................................');
    }

   
    private RegisterLocalTools(): void
    {
        LocalToolsDispatcher.Singleton.RegisterLocalTools
        (         
            new LTool_IncrementPatch(),
            new LTool_CheckGotchaLocalRepo(),
            new LTool_EditWalkthroughs(),
            new LTool_EditSnippets(),
            new LTool_EditLaunchFile(),
        )
    }

    private async DispatchAsync()
    {
        const arg0 = Process.Current.Args.FirstOrDefault();
        if (arg0)
        {
            // #region try local tool first
            const nextArgs = XString.Join('', Process.Current.Args.Skip(1).Items);
            const isLocalTool = await LocalToolsDispatcher.Singleton.TryAimTool(arg0, nextArgs.Value);
            // #endregion

            // #region if it's not a local tool, consult sheet
            if (isLocalTool == false)
            {
                new ExecFromSheet().TakeControlAsync(Process.Current.Args.FirstOrDefault())
            }
            // #endregion
        }
        else
        {
           // #region consult sheet
            new ExecFromSheet().TakeControlAsync(Process.Current.Args.FirstOrDefault())
           // #endregion
        }
    }

    public async StartAsync()
    {
        this.ShowStartupInfo();
        // WorkspaceAugmenter.EnsureWorkspaceAugmented();

        this.RegisterLocalTools();
        await this.DispatchAsync();
    }
}


new App().StartAsync();





