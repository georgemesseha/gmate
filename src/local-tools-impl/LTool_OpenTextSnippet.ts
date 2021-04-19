import { Path } from "decova-filesystem";
import { CurrentTerminal } from "decova-terminal";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { ILocalTool } from "./LocalToolsDispatcher";
import { PathMan } from "./Techies/PathMan";

export class LTool_OpenTextSnippet implements ILocalTool
{
    async TakeControlAsync(args: string): Promise<void>
    {
        PathMan.CurrentWorkspace_TextSnippets_Dir.Ensure()

        let fileNames = PathMan.CurrentWorkspace_TextSnippets_Dir.GetFiles().Select(f=>f.Name)
        let options:any = {}
        fileNames.Foreach(fn=> options[fn] = fn)

        const fileName = await CurrentTerminal.McqAsync("Pick a text snippet", options)
        console.log('fileName', fileName)
        const filePath = Path.Join(PathMan.CurrentWorkspace_TextSnippets_Dir.FullName, fileName)
        TerminalAgent.Exec(`"${filePath}"`)
    }
    GetHint(): string
    {
        return `Opens a text snippet of yours to edit.`
    }
    GetShortcut(): string
    {
        return `open-text-snippet`
    }
    
}