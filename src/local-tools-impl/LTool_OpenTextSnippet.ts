import { Path } from "decova-filesystem";
import { CurrentTerminal } from "decova-terminal";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { ILocalTool } from "./LocalToolsDispatcher";
import { PathMan } from "./Techies/PathMan";

export class LTool_OpenTextSnippet implements ILocalTool
{
    async TakeControlAsync(args: string): Promise<void>
    {
        const dir = PathMan.GotchaLocalRepo_TextSnippets_Dir
        dir.Ensure()

        let fileNames = dir.GetFiles().Select(f=>f.Name)
        let options:any = {}
        fileNames.Foreach(fn=> options[fn] = fn)

        const fileName = await CurrentTerminal.McqAsync("Pick a text snippet", options)
        console.log('fileName', fileName)
        const filePath = Path.Join(dir.FullName, fileName)
        TerminalAgent.Exec(`"${filePath}"`)
    }
    GetHint(): string
    {
        return `Open/Edit a text snippet.`
    }
    GetShortcut(): string
    {
        return `open-text-snippet`
    }
    
}