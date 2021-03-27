import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { GotchaRepo } from "./Techies/ArtifactMan/GotchaRepo";
import { ILocalTool, LocalToolsDispatcher } from "./LocalToolsDispatcher";
import { LTool_CheckGotchaLocalRepo } from "./LTool_CheckGotchaLocalRepo";
import { CommonMenu } from "./Techies/CommonMenu";
import { PathMan } from "./Techies/PathMan";
import os from "os";
export abstract class LTool_AbstractEditAugmenterFile implements ILocalTool
{
    async TakeControlAsync(args: string): Promise<void>
    {
        const file = PathMan.GotchaLocalRepo_WalkthroughsSheet;
        while(file.Exists() == false)
        {
            TerminalAgent.ShowError(`File [${file.FullName}] doesn't exist. I'll try to check out the repo.`)
            await LocalToolsDispatcher.RunAsync(new LTool_CheckGotchaLocalRepo())
        }

        const cmd = os.platform() == "win32"? `code ${this.FilePath}`
                                            : `sudo code --user-data-dir="~/.vscode-root" ${this.FilePath}`

        await TerminalAgent.AskToRunCommandAsync(this.GetHint(), cmd);

        TerminalAgent.Hint(`Answer with 'Continue' when done with editing`)                                  
        let go = await CommonMenu.ShowContinueSkipAsync('>>>');
        if(go)
        {
            await GotchaRepo.CommitAsync();
            await GotchaRepo.PushAsync();
            // await GotchaRepo.PullAsync();
        }

    }

    abstract GetHint(): string;
    abstract GetShortcut(): string;

    abstract FilePath: string;
}

export class LTool_EditLaunchFile extends LTool_AbstractEditAugmenterFile
{
    public get FilePath()
    {
        return PathMan.GotchaLocalRepo_LaunchFile.FullName;
    }

    GetHint(): string
    {
        return `Guides you through editing and publishing Gotcha's augmenter launch settings`
    }
    GetShortcut(): string
    {
        return `edit-launch-file`
    }

}

export class LTool_EditSnippets extends LTool_AbstractEditAugmenterFile
{
    public get FilePath(): string
    {
        return PathMan.GotchaLocalRepo_DecovaSnippets.FullName;
    }
    // async TakeControlAsync(args: string): Promise<void>
    // {
    //     const file = PathMan.GotchaLocalRepo_WalkthroughsSheet;
    //     while(file.Exists() == false)
    //     {
    //         await LocalToolsDispatcher.RunAsync(new LTool_CheckGotchaLocalRepo())
    //     }

    //     await TerminalAgent.AskToRunCommandAsync(`Will open the Gotcha's local repo's decova.code-snippets for editing`, 
    //                                              `code ${PathMan.GotchaLocalRepo_DecovaSnippets.FullName}`);

    //     TerminalAgent.Hint(`Answer with 'Continue' when done with editing`)                                  
    //     let go = await CommonMenu.ShowContinueSkipAsync('>>>');
    //     if(go)
    //     {
    //         await GotchaRepo.CommitAsync();
    //         await GotchaRepo.PushAsync();
    //         await GotchaRepo.PullAsync();
    //     }

    // }
    GetHint(): string
    {
        return `Guides you through editing and publishing your code snippets`
    }
    GetShortcut(): string
    {
        return `edit-snippets`
    }

}

export class LTool_EditWalkthroughs extends LTool_AbstractEditAugmenterFile
{
    public get FilePath()
    {
        return PathMan.GotchaLocalRepo_WalkthroughsSheet.FullName;
    }

    // async TakeControlAsync(args: string): Promise<void>
    // {
    //     const file = PathMan.GotchaLocalRepo_WalkthroughsSheet;
    //     while(file.Exists() == false)
    //     {
    //         await LocalToolsDispatcher.RunAsync(new LTool_CheckGotchaLocalRepo())
    //     }

    //     await TerminalAgent.AskToRunCommandAsync(`Will open the local Walkthroughs sheet for editing`, 
    //                                              `code ${PathMan.GotchaLocalRepo_WalkthroughsSheet.FullName}`);

    //     TerminalAgent.Hint(`Answer with 'Continue' when done with editing`)                                  
    //     let go = await CommonMenu.ShowContinueSkipAsync('>>>');
    //     if(go)
    //     {
    //         await GotchaRepo.CommitAsync();
    //         await GotchaRepo.PushAsync();
    //         await GotchaRepo.PullAsync();
    //     }

    // }
    GetHint(): string
    {
        return `Guides you through editing and publishing your Walkthrougs`
    }
    GetShortcut(): string
    {
        return `edit-walkthroughs`
    }
}