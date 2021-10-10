import { Exception_InvalidProgramState } from "decova-dotnet";
import { Environment, Process } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { injectable, singleton } from "tsyringe";



export enum CommonDirName
{
    vscode = ".vscode",
    gotcha_main_dir = "decova-gotcha-data",
    // decova_gotcha_repo = "decova-gotcha-data",
    text_snippets = "text-snippets"
}

enum CommonFileName
{
    decovaSettings = "decova-settings.json",
    decovaSnippets = "decova.code-snippets",
    launch = "launch.json",
    tasksJson = "tasks.json",
    settings = "settings.json",
    packgeJson = "package.json",
    WalkthroughsSheet = "walkthroughs_sheet.json",
    WalkthroughsSchema = "walkthroughs_schema.json"
}


@singleton()
export class PathMan
{
    private _UserProfileDir: DirectoryInfo;
    get UserProfileDir(): DirectoryInfo
    {
        if(this._UserProfileDir) return this._UserProfileDir

        if(!process.env.USERPROFILE)
        {
            throw new Exception_InvalidProgramState("process.env.USERPROFILE", "process.env.USERPROFILE is empty or undefined");
        }

        this._UserProfileDir = new DirectoryInfo(process.env.USERPROFILE!);
        return this._UserProfileDir;
    }

    private _GotchaMainDir: DirectoryInfo;
    get GotchaMainDir(): DirectoryInfo
    {
        if(this._GotchaMainDir) return this._GotchaMainDir;

        this._GotchaMainDir = new DirectoryInfo(`${this.UserProfileDir.FullName}\\${CommonDirName.gotcha_main_dir}`);
        this._GotchaMainDir.Ensure();
        return this._GotchaMainDir;
    }

    // static get GotchaLocalDataDir(): DirectoryInfo
    // {
    //     const path = Path.Join(this.GotchaMainDir.FullName);
    //     const rootDataDir = new DirectoryInfo(path);
    //     rootDataDir.Ensure();

    //     return rootDataDir;
    // }

    // static get GotchaLocalRepoGitDir(): DirectoryInfo
    // {
    //     const path = Path.Join(this.GotchaLocalDataDir.FullName, ".git");
    //     return new DirectoryInfo(path);
    // }

    get GotchaLocalRepo_Vscode_Dir(): DirectoryInfo
    {
        const path = Path.Join(this.GotchaMainDir.FullName, CommonDirName.vscode)
        return new DirectoryInfo(path)
    }

    get GotchaLocalRepo_WalkthroughsSheet(): FileInfo
    {
        
        const path = Path.Join(this.GotchaMainDir.FullName, CommonFileName.WalkthroughsSheet);
        return new FileInfo(path);
    }

    // static get GotchaLocalRepo_WalkthroughsSchema(): FileInfo
    // {
    //     const path = Path.Join(this.GotchaLocalRepo.FullName, CommonFileName.WalkthroughsSchema);
    //     return new FileInfo(path);
    // }

    get GotchaLocalRepo_DecovaSettingsFile(): FileInfo
    {
        const path = Path.Join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonFileName.decovaSettings);
        return new FileInfo(path);
    }

    get GotchaLocalRepo_DecovaSnippets(): FileInfo
    {
        const path = Path.Join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonFileName.decovaSnippets);
        return new FileInfo(path);
    }

    
    get GotchaLocalRepo_LaunchFile(): FileInfo
    {
        const path = Path.Join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonFileName.launch);
        return new FileInfo(path);
    }

    get GotchaLocalRepo_SettingsFile(): FileInfo
    {
        const path = Path.Join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonFileName.settings);
        return new FileInfo(path);
    }


    get CurrentWorkspace(): DirectoryInfo
    {
        return DirectoryInfo.Current;
    }


    get CurrentWorkspace_VsCodeDir(): DirectoryInfo
    {
        const path = Path.Join(this.CurrentWorkspace.FullName, CommonDirName.vscode)
        return new DirectoryInfo(path);
    }

    

    get CurrentWorkspace_DecovaSettings(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.decovaSettings)
        return new FileInfo(path);
    }

    get CurrentWorkspace_Settings(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.settings)
        return new FileInfo(path);
    }

    get CurrentWorkspace_Tasks(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.tasksJson)
        return new FileInfo(path);
    }

    get CurrentWorkspace_DecovaSnippets(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.decovaSnippets)
        return new FileInfo(path);
    }

    get CurrentWorkspace_Lanuch(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.launch)
        return new FileInfo(path);
    }

    get GotchaLocalRepo_TextSnippets_Dir(): DirectoryInfo
    {
        const path = Path.Join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonDirName.text_snippets)
        return new DirectoryInfo(path);
    }

    get CurrentWorkspace_PackageJson(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace.FullName, CommonFileName.packgeJson)
        return new FileInfo(path);
    }

}