import { Process } from "decova-environment";
import { TerminalAgent } from "../../../external-sheet/TerminalAgent";
import { ExternalResources } from "../../ExternalResouces";
import { CommonMenu } from "../CommonMenu";
import { PathMan } from "../PathMan";

export class GotchaRepo
{
    static async PullAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;
        PathMan.GotchaLocalRepo.SetAsCurrentDirectory()
        await TerminalAgent.AskToRunCommandAsync(`Will pull Gotcha's repo to your machine`, `git pull ${ExternalResources.GitHub_DataRepo}`)
        entryWorkDir.SetAsCurrentDirectory();
    }

    static async CloneAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;
        PathMan.GotchaMainDir.SetAsCurrentDirectory()
        await TerminalAgent.AskToRunCommandAsync(`Will clone Gotcha's repo`, `git clone ${ExternalResources.GitHub_DataRepo}`)
        entryWorkDir.SetAsCurrentDirectory();
    }

    static async CommitAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;
        PathMan.GotchaLocalRepo.SetAsCurrentDirectory()
        await TerminalAgent.AskToRunCommandAsync('Will commit your changes', `git commit -m "Auto committed by Gotcha" .`)
        entryWorkDir.SetAsCurrentDirectory();
    }

    static async PushAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;
        PathMan.GotchaLocalRepo.SetAsCurrentDirectory()
        await TerminalAgent.AskToRunCommandAsync(`Will push Gotcha's repo commits`, `git push`)
        entryWorkDir.SetAsCurrentDirectory();
    }

    static async PromptThenCommitAndPushAsync()
    {
        TerminalAgent.Hint(`Commit and push changes?`)                                  
        let go = await CommonMenu.ShowContinueSkipAsync('>>>');
        if(go)
        {
            await GotchaRepo.CommitAsync();
            await GotchaRepo.PushAsync();
            // await GotchaRepo.PullAsync();
        }
    }
}