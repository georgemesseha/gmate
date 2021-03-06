import { Process } from "decova-environment";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { ExternalResources } from "./ExternalResouces";
import { PathMan } from "./Techies/PathMan";

export class Git
{
    static async GotchaRepo_PullAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;
        PathMan.GotchaLocalRepo.SetAsCurrentDirectory()
        await TerminalAgent.AskToRunCommandAsync(`Will pull Gotcha's repo to your machine`, `git pull ${ExternalResources.GitHub_DataRepo}`)
        entryWorkDir.SetAsCurrentDirectory();
    }

    static async GotchaRepo_CloneAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;
        PathMan.GotchaMainDir.SetAsCurrentDirectory()
        await TerminalAgent.AskToRunCommandAsync(`Will clone Gotcha's repo`, `git clone ${ExternalResources.GitHub_DataRepo}`)
        entryWorkDir.SetAsCurrentDirectory();
    }

    static async GotchaRepo_CommitAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;
        PathMan.GotchaLocalRepo.SetAsCurrentDirectory()
        await TerminalAgent.AskToRunCommandAsync('Will commit your changes', `git commit -m "Auto committed by Gotcha" .`)
        entryWorkDir.SetAsCurrentDirectory();
    }

    static async GotchaRepo_PushAsync()
    {
        const entryWorkDir = Process.Current.CurrentWorkingDirectory;
        PathMan.GotchaLocalRepo.SetAsCurrentDirectory()
        await TerminalAgent.AskToRunCommandAsync(`Will push Gotcha's repo commits`, `git push`)
        entryWorkDir.SetAsCurrentDirectory();
    }
}