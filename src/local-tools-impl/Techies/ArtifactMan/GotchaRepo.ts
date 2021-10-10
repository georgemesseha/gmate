import { Environment, Process } from "decova-environment";
import { container, inject, injectable, singleton } from "tsyringe";
import { TerminalAgent } from "../../../external-sheet/TerminalAgent";
import { ExternalResources } from "../../ExternalResouces";
import { CommonMenu } from "../CommonMenu";
import { PathMan } from "../PathMan";


@singleton()
export class GotchaRepo
{
    private srv_PathMan = container.resolve(PathMan);
    // private srv_GotchaRepo = container.resolve(GotchaRepo);

    async PullAsync()
    {
        if(!this.srv_PathMan.GotchaMainDir.Exists() ||
           !this.srv_PathMan.GotchaMainDir.GetDirectories().xAny(d=>d.Name == ".git"))
        {
            await this.CloneAsync();
        }
        else
        {
            const entryWorkDir = Process.Current.CurrentWorkingDirectory;

            this.srv_PathMan.GotchaMainDir.SetAsCurrentDirectory();
            TerminalAgent.HintCurrentDir();
            TerminalAgent.Hint(`Will pull Gotcha's repo to your machine`);
            await TerminalAgent.AskToRunCommandAsync(`git pull ${ExternalResources.GitHub_DataRepo}`);

            entryWorkDir.SetAsCurrentDirectory();
        }
    }

    async CloneAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;

        this.srv_PathMan.UserProfileDir.SetAsCurrentDirectory()
        await TerminalAgent.HintCurrentDir();
        await TerminalAgent.Hint(`Gonna clone Gotcha's repo`);
        await TerminalAgent.AskToRunCommandAsync(`git clone ${ExternalResources.GitHub_DataRepo}`);

        entryWorkDir.SetAsCurrentDirectory();
    }

    async CommitAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;

        this.srv_PathMan.GotchaMainDir.SetAsCurrentDirectory();
        TerminalAgent.Hint('Will commit your changes');
        await TerminalAgent.AskToRunCommandAsync(`git commit -m "Auto committed by Gotcha" .`);

        entryWorkDir.SetAsCurrentDirectory();
    }

    async PushAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;

        this.srv_PathMan.GotchaMainDir.SetAsCurrentDirectory();
        TerminalAgent.Hint(`Will push Gotcha's repo commits`);
        await TerminalAgent.AskToRunCommandAsync(`git push`);

        entryWorkDir.SetAsCurrentDirectory();
    }

    async PromptThenCommitAndPushAsync()
    {
        TerminalAgent.Hint(`Commit and push changes?`)                                  
        let go = await CommonMenu.ShowContinueSkipAsync('>>>');
        if(go)
        {
            await this.CommitAsync();
            await this.PushAsync();
            // await GotchaRepo.PullAsync();
        }
    }
}