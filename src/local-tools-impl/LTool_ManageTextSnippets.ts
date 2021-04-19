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
        PathMan.CurrentWorkspace_TextSnippets_Dir.Ensure();
        CurrentTerminal.Exec(`start ${PathMan.CurrentWorkspace_TextSnippets_Dir.FullName}`)

        await GotchaRepo.PromptThenCommitAndPushAsync();
    }
    GetHint(): string
    {
        return "Opens your text snippets folder to manage do your editing then guides you to commit and push."
    }
    GetShortcut(): string
    {
       return "manage-text-snippets"
    }
}