import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";



export enum CommonDirName
{
    vscode = ".vscode",
    decova_gotcha_repo = "decova-gotcha-data"
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


export class PathMan
{
    static get GotchaMainDir(): DirectoryInfo
    {
       
        return new DirectoryInfo(process.env.RootDir as string)
    }

    static get GotchaLocalRepo(): DirectoryInfo
    {
        const path = Path.Join(this.GotchaMainDir.FullName, 
                               CommonDirName.decova_gotcha_repo,
                               );

        return new DirectoryInfo(path);
    }

    static get GotchaLocalRepo_DecovaSnippets(): FileInfo
    {
        const path = Path.Join(this.GotchaLocalRepo.FullName, CommonFileName.decovaSnippets);
        return new FileInfo(path);
    }

    static get GotchaLocalRepo_WalkthroughsSheet(): FileInfo
    {
        const path = Path.Join(this.GotchaLocalRepo.FullName, CommonFileName.WalkthroughsSheet);
        return new FileInfo(path);
    }

    static get GotchaLocalRepo_WalkthroughsSchema(): FileInfo
    {
        const path = Path.Join(this.GotchaLocalRepo.FullName, CommonFileName.WalkthroughsSchema);
        return new FileInfo(path);
    }

    static get GotchaLocalRepo_DecovaSettingsFile(): FileInfo
    {
        const path = Path.Join(this.GotchaLocalRepo.FullName, CommonFileName.decovaSettings);
        return new FileInfo(path);
    }

    static get CurrentWorkspace(): DirectoryInfo
    {
        return DirectoryInfo.Current;
    }


    static get CurrentWorkspace_VsCodeDir(): DirectoryInfo
    {
        const path = Path.Join(this.CurrentWorkspace.FullName, CommonDirName.vscode)
        return new DirectoryInfo(path);
    }

    

    static get CurrentWorkspace_DecovaSettings(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.decovaSettings)
        return new FileInfo(path);
    }

    static get CurrentWorkspace_Settings(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.settings)
        return new FileInfo(path);
    }

    static get CurrentWorkspace_Tasks(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.tasksJson)
        return new FileInfo(path);
    }

    static get CurrentWorkspace_DecovaSnippets(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.decovaSnippets)
        return new FileInfo(path);
    }

    static get CurrentWorkspace_Lanuch(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.launch)
        return new FileInfo(path);
    }

    static get CurrentWorkspace_PackageJson(): FileInfo
    {
        const path = Path.Join(this.CurrentWorkspace.FullName, CommonFileName.packgeJson)
        return new FileInfo(path);
    }

}