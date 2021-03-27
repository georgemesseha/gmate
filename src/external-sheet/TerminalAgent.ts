import { CurrentTerminal } from "decova-terminal";
import { Background, Foreground } from "decova-terminal";
import { CommonMenu } from "../local-tools-impl/Techies/CommonMenu";

export class TerminalAgent
{
    public static ShowSuccess(text: string)
    {
        CurrentTerminal.Echo(` ¤¤¤ ${text}`, Foreground.green, 
                                          Background.bgBlack, 
                                          2, 
                                          true, 
                                          true, 
                                          false, 
                                          true);
    }

    public static Instruct(text: string)
    {
        CurrentTerminal.Echo(`♣♣♣ ${text}`, Foreground.cyanBright, 
                                          Background.bgBlack, 
                                          2, 
                                          true, 
                                          true, 
                                          false, 
                                          true);
    }

    public static Exec(cmdText: string)
    {
        CurrentTerminal.Exec(cmdText);
    }

    public static Hint(hint: string)
    {
        CurrentTerminal.Echo(`HINT: ${hint}`, 
                              Foreground.yellow, 
                              Background.bgBlack, 
                              1, 
                              true, 
                              false, 
                              false, 
                              true);
    }

    public static ShowError(error: string)
    {
        CurrentTerminal.Echo(`! ${error}`, Foreground.redBright, 
                                          Background.bgBlack, 
                                          1, 
                                          true, 
                                          true, 
                                          false, 
                                          true);
    }

    public static ShowQuestion(question: string)
    {
        CurrentTerminal.Echo(question, Foreground.magentaBright, 
                                          Background.bgBlack, 
                                          1, 
                                          true, 
                                          true, 
                                          false, 
                                          true);
    }


    public static async AskForTextAsync(promptHint: string)
    {
        this.ShowQuestion(promptHint);
        return await CurrentTerminal.AskForTextAsync('>>>')
    }

    public static async AskToRunCommandAsync(hint: string, cmd: string)
    {
        TerminalAgent.Hint(hint);
        const run:boolean = await CommonMenu.ShowContinueSkipAsync('>>>');
        if(run)
        {
            TerminalAgent.Exec(cmd);
        }
        else
        {
            TerminalAgent.ShowError('Command was cancelled by user!')
        }
    }
}