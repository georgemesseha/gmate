import { Process } from "decova-environment";
import { Path } from "decova-filesystem";
import { Intellisense } from "../external-sheet/Intellisense";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { ExternalResources } from "./ExternalResouces";
import { GotchaRepo } from "./Techies/ArtifactMan/GotchaRepo";
// import { ILocalTool } from "./LocalToolsDispatcher";

import { PathMan } from "./Techies/PathMan";
import { container, singleton } from "tsyringe";
import { AbstractLocalTool } from "./Techies/AbstractLocalTool";

@singleton()
export class LTool_CheckOutGotchaLocalRepo implements AbstractLocalTool
{
    private readonly srv_GotchaRepo = container.resolve(GotchaRepo);
    private readonly srv_PathMan = container.resolve(PathMan);
    
    GetHint(): string
    {
        return `ًGonna pull Gotcha's data.`
    }
    GetShortcut(): string
    {
        return 'pull'
    }

    
    async TakeControlAsync(args: string): Promise<void>
    {
        if(!this.srv_PathMan.GotchaMainDir.Exists() || 
           !this.srv_PathMan.GotchaMainDir.GetDirectories().xAny(d => d.Name === ".git"))
        {
            await this.srv_GotchaRepo.CloneAsync();
        }
        else
        {
            TerminalAgent.ShowQuestion('Gotcha repo exists, force update?');
            const intelli = new Intellisense<string>(["Yes", "No"], op => op);
            const ans = await intelli.PromptAsync('>>>');
            if (ans == 'Yes')
            {
               await this.srv_GotchaRepo.PullAsync();
            }
        }
        return Promise.resolve();
    }
}