import { Path } from "decova-filesystem";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { ILocalTool } from "./LocalToolsDispatcher";
import { LTool_AbstractEditAugmenterFile } from "./LTool_EditAugmenterFile";
import { PathMan } from "./Techies/PathMan";

export class LTool_CopyVscodeFile implements ILocalTool
{
    async TakeControlAsync(args: string): Promise<void>
    {    
        const vsCodeFiles = PathMan.GotchaLocalRepo_Vscode_Dir.GetFiles().Array

        function copy(fileName:string)
        {
            const src = Path.Join(PathMan.GotchaLocalRepo_Vscode_Dir.FullName, fileName)
            const dst = Path.Join(PathMan.CurrentWorkspace_VsCodeDir.FullName, fileName)

            TerminalAgent.Exec(`copy "${src}" "${dst}"`)
        }

        if(args)
        {
            const targetFile = vsCodeFiles.xFirstOrDefault(f=>f.Name.toLowerCase() == args.toLowerCase())
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