import { DirectoryInfo, Encoding, FileInfo } from "decova-filesystem";
import { List, Dictionary, Exception, SemVersion } from "decova-dotnet-developer";
import { Json } from "decova-json";
import { Process, Environment } from 'decova-environment'
import path from 'path';
import { CurrentTerminal } from "decova-terminal";

interface LooseObject {
    [key: string]: any
}
export class PackageManifest
{
    constructor(public FilePath: string)
    {
        Json.Populate(this, this.FilePath);   
    }

    public name: string = '';
    public version: string = '';
    public liscense: string = '';
    public main: string = '';
    public module: string = '';
    public description: string = '';
    public sourceMap:boolean = true;
    public inlineSourceMap:boolean = false;
    public outDir: string = '';
    public scripts: string[] = [];
    public get Scripts():List<String>
    {
        return new List<string>(this.scripts);
    }
    public files: string[] = [];
    public get Files():List<String>
    {
        return new List<string>(this.files);
    }
    public keywords: string[] = [];
    public get Keywords():List<String>
    {
        return new List<string>(this.keywords);
    }
    public dependencies:object = new Object();
    public get Dependencies():Dictionary<string, string>
    {
        return Dictionary.FromObjectProps<string>(this.dependencies);
    }
    public bin:object = new Object();
    public get Bin():Dictionary<string, string>
    {
        return Dictionary.FromObjectProps<string>(this.bin);
    }
    public devDependencies:object = new Object();
    public get DevDependencies():Dictionary<string, string>
    {
        return Dictionary.FromObjectProps<string>(this.devDependencies);
    }

    public SaveAs(filePath: string)
    {
        const objToSave = {... this};
        delete (objToSave as any).FilePath
        Json.TrySave(filePath, objToSave, true);
    }

    public Save()
    {
        this.SaveAs(this.FilePath);
    }
    
}

class DecovaSettings
{
    public nodeProjectsContainers: string[] = [];
}

export enum CommonFileName
{
    decovaSettings = "decova-settings.json",
    decovaSnippets = "decova.code-snippets",
    launch = "launch.json",
    tasksJson = "tasks.json",
    settings = "settings.json",
    packgeJson = "package.json",
    
}
export enum CommonDirName
{
    vscode = ".vscode",
}

export class PackMan
{
    private _filePath: string;
    private _manifest: PackageManifest;
    
    constructor(public PackageDir: string)
    {
        this._filePath = path.join(PackageDir, `package.json`);
        
        if(new FileInfo(this._filePath).Exists() === false)
            throw new Exception(`Package file not found @ [${this._filePath}]`);
    
        try
        {
            this._manifest = Json.Load<PackageManifest>(this._filePath);
        }
        catch(error:any)
        {
            throw new Exception(`Couldn't load configuration file`, error as Exception);
        }
    }

    public async IncrementVersionPatch(): Promise<string>
    {
        try 
        {
            
            const version = new SemVersion(this._manifest.version);
            version.Patch ++;
            this._manifest.version = version.Text;

            const packageFilePath = path.join(this.PackageDir, 'package.json');
            Json.TrySave(packageFilePath, this._manifest, true, true);
            return version.Text;
        } 
        catch (err) 
        {
            console.log(err);
            throw err;
        }
    }

    public GetProjectsContainerDirs(): List<DirectoryInfo>
    {
        const workSpace = Process.Current.CurrentWorkingDirectory.FullName;       
        const decovaSettingsFile = path.join(workSpace, CommonDirName.vscode , CommonFileName.decovaSettings);
        let decovaSettings = Json.Load<DecovaSettings>(decovaSettingsFile);
        return new List<string>(decovaSettings.nodeProjectsContainers).Select(path=> new DirectoryInfo(path));       
    }

    public GetAllProjectManifests(): List<PackageManifest>
    {
        function isProjectDir(dir: DirectoryInfo): boolean
        {
            return dir.GetFiles().Any(f=>f.Name.toLowerCase() == 'package.json');
        }
        function getManifestFile(projDir: DirectoryInfo): FileInfo
        {
            return new FileInfo(path.join(projDir.FullName, CommonFileName.packgeJson));
        }
        const allProjectDirs = this.GetProjectsContainerDirs()
                                   .SelectMany(d=>d.GetDirectories())
                                   .Where(d=>isProjectDir(d));
        const allPackgeJsonFiles = allProjectDirs.Select(d=>getManifestFile(d));
        
        return allPackgeJsonFiles.Select(f=>new PackageManifest(f.FullName));
    }

    public GetDependentManifests(): List<PackageManifest>
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
            const updateDependencyVersion = (dependentManifest: PackageManifest) =>
            {
                (dependentManifest.dependencies as LooseObject)[this._manifest.name] = `^${this._manifest.version}`;
                dependentManifest.Save();
                CurrentTerminal.DoneMessage(`[${dependentManifest.name}] was configured as [${this._manifest.name}:^${this._manifest.version}] dependent.`);           
            }
            allDependencies.Foreach(dp => updateDependencyVersion(dp));
        }
    }
}

