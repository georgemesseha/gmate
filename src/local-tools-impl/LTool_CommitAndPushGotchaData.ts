import { ILocalTool } from "./LocalToolsDispatcher";
import { GotchaRepo } from "./Techies/ArtifactMan/GotchaRepo";

export class LTool_CommitAndPushGotchaData implements ILocalTool
{
    async TakeControlAsync(args: string): Promise<void>
    {
        await GotchaRepo.PromptThenCommitAndPushAsync()
    }
    GetHint(): string
    {
        return "Commits and pushes the changes in your Gotcha data local repo"
    }
    GetShortcut(): string
    {
        return "push"
    }
    
}