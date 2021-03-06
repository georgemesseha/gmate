import { Process } from "decova-environment";
import { Path } from "decova-filesystem";
import { Intellisense } from "../external-sheet/Intellisense";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { ExternalResources } from "./ExternalResouces";
import { GotchaRepo } from "./Techies/ArtifactMan/GotchaRepo";
import { ILocalTool } from "./LocalToolsDispatcher";

import { PathMan } from "./Techies/PathMan";

export class LTool_CheckGotchaLocalRepo implements ILocalTool
{
    GetHint(): string
    {
        return `Will make sure you locally have Gotcha's repo.`
    }
    GetShortcut(): string
    {
        return 'check-repo'
    }

    async TakeControlAsync(args: string): Promise<void>
    {
        if(PathMan.GotchaLocalRepo.Exists() == false || PathMan.GotchaLocalRepo.GetFiles().Count == 0)
        {
            await GotchaRepo.CloneAsync();        
        }
        else
        {
            TerminalAgent.ShowQuestion('Gotcha repo exists, force update?')
            const intelli = new Intellisense<string>(["Yes", "No"], op => op)
            const ans = await intelli.PromptAsync('>>>');
            if (ans == 'Yes')
            {
               await GotchaRepo.PullAsync();
            }
        }
        return Promise.resolve();
    }
}