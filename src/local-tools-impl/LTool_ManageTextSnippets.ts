import { FileInfo, Path } from "decova-filesystem";
import { CurrentTerminal } from "decova-terminal";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { ILocalTool } from "./LocalToolsDispatcher";
import { GotchaRepo } from "./Techies/ArtifactMan/GotchaRepo";
import { PathMan } from "./Techies/PathMan";

export class LTool_ManageTextSnippets implements ILocalTool
{
    async TakeControlAsync(args: string): Promise<void>
    {
        const dir = PathMan.GotchaLocalRepo_TextSnippets_Dir
        dir.Ensure();
        CurrentTerminal.Exec(`start ${dir.FullName}`)

        await GotchaRepo.PromptThenCommitAndPushAsync();
    }
    GetHint(): string
    {
        return "Edit my text snippets folder."
    }
    GetShortcut(): string
    {
       return "manage-text-snippets"
    }
}