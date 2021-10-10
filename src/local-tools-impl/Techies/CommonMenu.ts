import { Intellisense } from "../../external-sheet/Intellisense";

export class CommonMenu
{
    public static async ShowContinueSkipAsync(question: string): Promise<boolean>
    {
        const options = ['1- Continue', '0- Skip'];
        const intelli = new Intellisense(options, (op) => op)
        const ans = await intelli.PromptAsync(question);

        switch(ans)
        {
            case '1- Continue':
                return true;

            case '0- Skip':
            default:
                return false;
        }
    }
}