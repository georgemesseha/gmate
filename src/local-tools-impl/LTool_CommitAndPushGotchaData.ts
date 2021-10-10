import { container, singleton } from "tsyringe";
import { AbstractLocalTool } from "./Techies/AbstractLocalTool";
// import { ILocalTool } from "./LocalToolsDispatcher";
import { GotchaRepo } from "./Techies/ArtifactMan/GotchaRepo";

@singleton()
export class LTool_CommitAndPushGotchaData extends AbstractLocalTool
{
    private readonly srv_GotchaRepo = container.resolve(GotchaRepo);

    async TakeControlAsync(args: string): Promise<void>
    {
        await this.srv_GotchaRepo.PromptThenCommitAndPushAsync()
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