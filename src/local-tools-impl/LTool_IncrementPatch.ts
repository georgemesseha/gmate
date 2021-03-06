import { List } from "decova-dotnet-developer";
import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { CurrentTerminal } from "decova-terminal";
import { Intellisense } from "../external-sheet/Intellisense";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { ILocalTool } from "./LocalToolsDispatcher";

import { DecovaSettings } from "./Techies/DecovaSpecific/DecovaSettings";
import { PackageJson } from "./Techies/Package-General/PackageJson";
import { PathMan } from "./Techies/PathMan";

export class LTool_IncrementPatch implements ILocalTool
{
    GetHint(): string
    {
        return `Will increment the patch part of your currently being edited package, and optionally update the dependent workspaces.`
    }
    GetShortcut(): string
    {
        return 'patch++';
    }

    async TakeControlAsync(args: string): Promise<void>
    {
        const workSpace = Process.Current.CurrentWorkingDirectory.FullName;
        const pkgFile = new FileInfo(Path.Join(workSpace, 'package.json'));

        if(pkgFile.Exists() == false)
        {
            TerminalAgent.Hint(`Current Directory: ${DirectoryInfo.Current.FullName}`)
            TerminalAgent.ShowError('No package.json found in the current directory');
            return;
        }


        const pkg = new PackageJson(pkgFile.FullName);

        pkg.IncrementVersionPatch(true);

        const qUpdateDependentWorkspaces = new Intellisense<string>(["Yes", "No"], op=>op);
        const ans = await qUpdateDependentWorkspaces.PromptAsync('Update as the minimum for dependent workspaces?');

        if(ans == "Yes")
        {
            await this.UpdateDependentWorkspaces();
        }
    }

    private async EnsureDecovaSetting()
    {
        TerminalAgent.Exec(`ggg `)
    }

    private async UpdateDependentWorkspaces()
    {
        let decovaSettings = DecovaSettings.LoadOfCurrentWorkspace();
        while (!decovaSettings)
        {
            this.EnsureDecovaSetting();
            decovaSettings = DecovaSettings.LoadOfCurrentWorkspace();
        }

        const supposedFilePath = PathMan.GotchaLocalRepo_DecovaSettingsFile;
        TerminalAgent.ShowError(`File not found [${supposedFilePath.FullName}]`);

    }
}