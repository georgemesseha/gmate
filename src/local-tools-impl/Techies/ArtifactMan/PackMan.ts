import path from 'path';
import { DirectoryInfo, Encoding, FileInfo } from "decova-filesystem";
import { Json } from "decova-json";
import { Process, Environment } from 'decova-environment'
import { CurrentTerminal } from "decova-terminal";
import { PackageJson } from "../Package-General/PackageJson";
import { DecovaSettings } from "./DecovaSettings";
import { PathMan } from "../PathMan";
import { TerminalAgent } from "../../../external-sheet/TerminalAgent";
import { container, inject } from "tsyringe";
import { Exception } from "decova-dotnet";


export class PackMan
{
    private _filePath: string;
    private _manifest: PackageJson;
    private srv_PathMan: PathMan = container.resolve<PathMan>(PathMan);

    constructor(public PackageDir: string)
    {
        this._filePath = path.join(PackageDir, `package.json`);

        if (new FileInfo(this._filePath).Exists() === false)
            throw new Exception(`Package file not found @ [${this._filePath}]`);

        try
        {
            this._manifest = Json.Load<PackageJson>(this._filePath);
        }
        catch (error)
        {
            throw new Exception(`Couldn't load configuration file`, error as Exception);
        }
    }

    public GetProjectsContainerDirs(): DirectoryInfo[]
    {
        const workSpace = Process.Current.CurrentWorkingDirectory.FullName;
        const decovaSettingsFile = this.srv_PathMan.CurrentWorkspace_DecovaSettings.FullName;
        let decovaSettings = Json.Load<DecovaSettings>(decovaSettingsFile);
        return decovaSettings.nodeProjectsContainers.xSelect(path => new DirectoryInfo(path));
    }

    public GetAllProjectManifests(): PackageJson[]
    {
        function isProjectDir(dir: DirectoryInfo): boolean
        {
            return dir.GetFiles().xAny(f => f.Name.toLowerCase() == 'package.json');
        }
        function getManifestFile(projDir: DirectoryInfo): FileInfo
        {
            return new FileInfo(path.join(projDir.FullName, 'package.json'));
        }
        const allProjectDirs = this.GetProjectsContainerDirs()
            .xFlatten(d => d.GetDirectories())
            .xWhere(d => isProjectDir(d));
        const allPackgeJsonFiles = allProjectDirs.xSelect(d => getManifestFile(d));

        return allPackgeJsonFiles.xSelect(f => new PackageJson(f.FullName));
    }

    public GetDependentManifests(): PackageJson[]
    {
        return this.GetAllProjectManifests().xWhere(m => m.Dependencies.xContains(this._manifest.name));
    }

    public UpdateLeastVersionOnDependents()
    {
        const allDependencies = this.GetDependentManifests();
        if (allDependencies.xCount() == 0)
        {
            CurrentTerminal.DisplayInfo(`No dependent workspaces detected!`)
        }
        else
        {
            const updateDependencyVersion = (dependentManifest: PackageJson) =>
            {
                (dependentManifest.dependencies as any)[this._manifest.name] = `^${this._manifest.version}`;

                try
                {
                    dependentManifest.Save();
                    TerminalAgent.ShowSuccess(`[${dependentManifest.name}] was configured as [${this._manifest.name}:^${this._manifest.version}] dependent.`);
                } 
                catch (err)
                {
                    TerminalAgent.ShowError(`Failed to update [${dependentManifest.name}] with patch of [${this._manifest.name}:^${this._manifest.version}].`);
                }
            }
            allDependencies.xForeach(dp => updateDependencyVersion(dp));
        }
    }
}

