import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { Git } from "./Git";
import { ILocalTool, LocalToolsDispatcher } from "./LocalToolsDispatcher";
import { LTool_CheckGotchaLocalRepo } from "./LTool_CheckGotchaLocalRepo";
import { CommonMenu } from "./Techies/CommonMenu";
import { PathMan } from "./Techies/PathMan";

export class LTool_EditWalkthroughs implements ILocalTool
{
    async TakeControlAsync(args: string): Promise<void>
    {
        const file = PathMan.GotchaLocalRepo_WalkthroughsSheet;
        while(file.Exists() == false)
        {
            await LocalToolsDispatcher.RunAsync(new LTool_CheckGotchaLocalRepo())
        }

        await TerminalAgent.AskToRunCommandAsync(`Will open the local Walkthroughs sheet for editing`, 
                                                 `code ${PathMan.GotchaLocalRepo_WalkthroughsSheet.FullName}`);

        TerminalAgent.Hint(`Answer with 'Continue' when done with editing`)                                  
        let go = await CommonMenu.ShowContinueSkipAsync('>>>');
        if(go)
        {
            await Git.GotchaRepo_CommitAsync();
            await Git.GotchaRepo_PushAsync();
            await Git.GotchaRepo_PullAsync();
        }

    }
    GetHint(): string
    {
        return `Will guide you through editing and publishing your Walkthrougs`
    }
    GetShortcut(): string
    {
        return `edit-walkthroughs`
    }

}