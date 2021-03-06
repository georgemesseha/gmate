import { DirectoryInfo, Encoding, FileInfo } from "decova-filesystem";
import { List, Exception, SemVersion } from "decova-dotnet-developer";
import { Json } from "decova-json";
import { Process, Environment } from 'decova-environment'
import path from 'path';
import { CurrentTerminal } from "decova-terminal";
import { PackageJson } from "./Package-General/PackageJson";
import { DecovaSettings } from "./DecovaSpecific/DecovaSettings";
import { PathMan } from "./PathMan";


export class PackMan
{
    private _filePath: string;
    private _manifest: PackageJson;
    
    constructor(public PackageDir: string)
    {
        this._filePath = path.join(PackageDir, `package.json`);
        
        if(new FileInfo(this._filePath).Exists() === false)
            throw new Exception(`Package file not found @ [${this._filePath}]`);
    
        try
        {
            this._manifest = Json.Load<PackageJson>(this._filePath);
        }
        catch(error)
        {
            throw new Exception(`Couldn't load configuration file`, error as Exception);
        }
    }

    

    public GetProjectsContainerDirs(): List<DirectoryInfo>
    {
        const workSpace = Process.Current.CurrentWorkingDirectory.FullName;       
        const decovaSettingsFile = PathMan.CurrentWorkspace_DecovaSettings.FullName;
        let decovaSettings = Json.Load<DecovaSettings>(decovaSettingsFile);
        return new List<string>(decovaSettings.nodeProjectsContainers).Select(path=> new DirectoryInfo(path));       
    }

    public GetAllProjectManifests(): List<PackageJson>
    {
        function isProjectDir(dir: DirectoryInfo): boolean
        {
            return dir.GetFiles().Any(f=>f.Name.toLowerCase() == 'package.json');
        }
        function getManifestFile(projDir: DirectoryInfo): FileInfo
        {
            return new FileInfo(path.join(projDir.FullName, 'package.json'));
        }
        const allProjectDirs = this.GetProjectsContainerDirs()
                                   .SelectMany(d=>d.GetDirectories())
                                   .Where(d=>isProjectDir(d));
        const allPackgeJsonFiles = allProjectDirs.Select(d=>getManifestFile(d));
        
        return allPackgeJsonFiles.Select(f=>new PackageJson(f.FullName));
    }

    public GetDependentManifests(): List<PackageJson>
    {
        return this.GetAllProjectManifests().Where(m=>m.Dependencies.Contains(this._manifest.name));
    }

    public UpdateLeastVersionOnDependents()
    {
        const allDependencies = this.GetDependentManifests();
        if(allDependencies.Count == 0)
        {
            CurrentTerminal.DisplayInfo(`No dependent workspaces detected!`)
        }
        else
        {
            const updateDependencyVersion = (dependentManifest: PackageJson) =>
            {
                (dependentManifest.dependencies as any)[this._manifest.name] = `^${this._manifest.version}`;
                dependentManifest.Save();
                CurrentTerminal.DoneMessage(`[${dependentManifest.name}] was configured as [${this._manifest.name}:^${this._manifest.version}] dependent.`);           
            }
            allDependencies.Foreach(dp => updateDependencyVersion(dp));
        }
    }
}

