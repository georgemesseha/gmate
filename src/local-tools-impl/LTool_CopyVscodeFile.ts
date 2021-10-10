import { Path } from "decova-filesystem";
import { container, singleton } from "tsyringe";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
// import { ILocalTool } from "./LocalToolsDispatcher";
import { LTool_AbstractEditAugmenterFile } from "./LTool_EditAugmenterFile";
import { AbstractLocalTool } from "./Techies/AbstractLocalTool";
import { PathMan } from "./Techies/PathMan";

@singleton()
export class LTool_CopyVscodeFile implements AbstractLocalTool
{
    private readonly srv_PathMan = container.resolve(PathMan);
    
    async TakeControlAsync(args: string): Promise<void>
    {    
        const vsCodeFiles = this.srv_PathMan.GotchaLocalRepo_Vscode_Dir.GetFiles();

        const copy = (fileName:string) =>
        {
            const src = Path.Join(this.srv_PathMan.GotchaLocalRepo_Vscode_Dir.FullName, fileName)
            const dst = Path.Join(this.srv_PathMan.CurrentWorkspace_VsCodeDir.FullName, fileName)

            TerminalAgent.Exec(`copy "${src}" "${dst}"`)
        }

        if(args)
        {
            const targetFile = vsCodeFiles.xFirstOrNull(f=>f.Name.toLowerCase() == args.toLowerCase())
            if(targetFile)
            {
                copy(targetFile.Name)       
            }
            else
            {
                TerminalAgent.ShowError(`Bad .vscode file name`)
            }
        }
        else
        {
            const fileName = await TerminalAgent.PickOneAsync("What file?", vsCodeFiles.xSelect(f=>f.Name))
            copy(fileName)
        }
        
    }
    GetHint(): string
    {
        return "Copy .vscode file from (Gotcha repo -> current workspace)"
    }
    GetShortcut(): string
    {
        return "copy-vscode-file"
    }

}