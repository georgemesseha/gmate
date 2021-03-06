import { List } from "decova-dotnet-developer";
import { Intellisense } from "../../external-sheet/Intellisense";

export class CommonMenu
{
    public static async ShowContinueSkipAsync(question: string): Promise<boolean>
    {
        const options = new List<any>(['Continue', 'Skip'])
        const intelli = new Intellisense(options, (op) => op)
        const ans = await intelli.PromptAsync(question);

        switch(ans)
        {
            case 'Continue':
                return true;
            case 'Skip':
            default:
                return false;
        }
    }
}