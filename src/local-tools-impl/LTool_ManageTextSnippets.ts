import { FileInfo, Path } from "decova-filesystem";
import { CurrentTerminal } from "decova-terminal";
import { container, inject, singleton } from "tsyringe";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { AbstractLocalTool } from "./Techies/AbstractLocalTool";
import { GotchaRepo } from "./Techies/ArtifactMan/GotchaRepo";
import { PathMan } from "./Techies/PathMan";

@singleton()
export class LTool_ManageTextSnippets extends AbstractLocalTool
{
    private readonly srv_PathMan = container.resolve(PathMan);
    private readonly srv_GotchaRepo = container.resolve(GotchaRepo);

    async TakeControlAsync(args: string): Promise<void>
    {
        const dir = this.srv_PathMan.GotchaLocalRepo_TextSnippets_Dir
        dir.Ensure();
        CurrentTerminal.Exec(`start ${dir.FullName}`)

        await this.srv_GotchaRepo.PromptThenCommitAndPushAsync();
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