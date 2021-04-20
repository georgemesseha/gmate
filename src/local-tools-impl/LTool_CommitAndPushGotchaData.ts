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
        return "Push Gotcha's data"
    }
    GetShortcut(): string
    {
        return "push"
    }
    
}