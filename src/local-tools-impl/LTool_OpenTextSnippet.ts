import { Path } from "decova-filesystem";
import { CurrentTerminal } from "decova-terminal";
import { container, singleton } from "tsyringe";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { AbstractLocalTool } from "./Techies/AbstractLocalTool";
// import { ILocalTool } from "./LocalToolsDispatcher";
import { PathMan } from "./Techies/PathMan";

@singleton()
export class LTool_OpenTextSnippet implements AbstractLocalTool
{
    private readonly srv_PathMan = container.resolve(PathMan);

    async TakeControlAsync(args: string): Promise<void>
    {
        const dir = this.srv_PathMan.GotchaLocalRepo_TextSnippets_Dir
        dir.Ensure()

        let fileNames = dir.GetFiles().xSelect(f=>f.Name)
        let options:any = {}
        fileNames.xForeach(fn=> options[fn] = fn)

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