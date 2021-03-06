import { BackgroundColor } from "chalk";
import { List } from "decova-dotnet-developer";
import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { CurrentTerminal } from "decova-terminal";
import { Intellisense } from "../external-sheet/Intellisense";
import { TerminalAgent } from "../external-sheet/TerminalAgent";
import { ILocalTool } from "./LocalToolsDispatcher";
import { PackageJson } from "./Techies/Package-General/PackageJson";
import { PackMan } from "./Techies/ArtifactMan/PackMan";
import { PathMan } from "./Techies/PathMan";
import { DecovaSettings } from "./Techies/ArtifactMan/DecovaSettings";

export class LTool_IncrementPatch implements ILocalTool
{
    GetHint(): string
    {
        return `Increments the patch part of your currently being edited package, and optionally update the dependent workspaces.`
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
        TerminalAgent.ShowSuccess(`Package version was updated to ${pkg.version}`)

        const qUpdateDependentWorkspaces = new Intellisense<string>(["Yes", "No"], op=>op);
        const ans = await qUpdateDependentWorkspaces.PromptAsync('Update as the minimum for dependent workspaces?');

        if(ans == "Yes")
        {
           const success: boolean = await this.UpdateDependentWorkspacesAsync(); 
        }
    }

    
    private async UpdateDependentWorkspacesAsync(): Promise<boolean>
    {
        await DecovaSettings.EnsureInCurrentWorkspace();
       

        let packMan: PackMan;
        try
        {
            packMan = new PackMan(DirectoryInfo.Current.FullName)
        }
        catch(err)
        {
            TerminalAgent.ShowError(`Couldn't load package.json from current directory [${DirectoryInfo.Current.FullName}]`)
            return false;
        }
        try
        {
            packMan.UpdateLeastVersionOnDependents();
            return true;
        }
        catch(error)
        {
            TerminalAgent.ShowError(`Couldn't update some or all of dependent packages with the patch`)
            return false;
        }
    }
}