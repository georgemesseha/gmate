import 'reflect-metadata';
import 'decova-dotnet'
import chalk from "chalk";
import { Process } from "decova-environment";

import figlet from "figlet";
import { ExecFromSheet } from "./external-sheet/ExecFromSheet";
import Main from './Main'
import { QuickCommands } from "./local-tools-impl/__old/QuickCommands";
import { WorkspaceAugmenter } from "./local-tools-impl/Techies/DecovaSpecific/WorkspaceAugmenter";
import { LocalToolsDispatcher } from "./local-tools-impl/LocalToolsDispatcher";
import { LTool_IncrementPatch } from "./local-tools-impl/LTool_IncrementPatch";
import { DirectoryInfo } from "decova-filesystem";
import { LTool_CheckOutGotchaLocalRepo } from "./local-tools-impl/LTool_CheckGotchaLocalRepo";
import
    {
        LTool_EditWalkthroughs,
        LTool_EditSnippets,
        LTool_EditLaunchFile
    } from "./local-tools-impl/LTool_EditAugmenterFile";
import { LTool_ManageTextSnippets } from "./local-tools-impl/LTool_ManageTextSnippets";
import { LTool_OpenTextSnippet } from "./local-tools-impl/LTool_OpenTextSnippet";
import { LTool_CommitAndPushGotchaData } from './local-tools-impl/LTool_CommitAndPushGotchaData';
import { LTool_CopyVscodeFile } from './local-tools-impl/LTool_CopyVscodeFile';
import { container } from 'tsyringe';

const pjson = require('../package.json');

export class App
{

    private readonly srv_LocalToolsDispatcher = container.resolve(LocalToolsDispatcher);
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
        this.srv_LocalToolsDispatcher.RegisterLocalTools
            (
                container.resolve(LTool_IncrementPatch),
                container.resolve(LTool_CheckOutGotchaLocalRepo),
                container.resolve(LTool_EditWalkthroughs),
                container.resolve(LTool_EditSnippets),
                container.resolve(LTool_EditLaunchFile),
                container.resolve(LTool_ManageTextSnippets),
                container.resolve(LTool_OpenTextSnippet),
                container.resolve(LTool_CommitAndPushGotchaData),
                container.resolve(LTool_CopyVscodeFile)
            )
    }

    private async DispatchAsync()
    {
        const arg0 = Process.Current.Args.xFirstOrNull();
        if (arg0)
        {
            // #region try local tool first
            const nextArgs = String.xJoin('', Process.Current.Args.xSkip(1));
            const isLocalTool = await this.srv_LocalToolsDispatcher.TryAimToolAsync(arg0, nextArgs);
            // #endregion

            // #region if it's not a local tool, consult sheet
            if (isLocalTool == false)
            {
                new ExecFromSheet().TakeControlAsync(Process.Current.Args.xFirstOrNull())
            }
            // #endregion
        }
        else
        {
            // #region consult sheet
            new ExecFromSheet().TakeControlAsync(Process.Current.Args.xFirstOrNull())
            // #endregion
        }
    }

    public async StartAsync()
    {
        try
        {
            this.ShowStartupInfo();
            this.RegisterLocalTools();
            await this.DispatchAsync();
        } 
        catch (err)
        {
            console.error(err);
        }
    }
}


try
{
    new App().StartAsync();
}
catch (err)
{
    console.error(err)
}
