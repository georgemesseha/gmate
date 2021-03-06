import { DirectoryInfo, FileInfo } from "decova-filesystem";
import path from 'path'



export class WorkspaceAugmenter
{
    private static get VsCodeDir(): DirectoryInfo
    {
        return new DirectoryInfo(path.join(DirectoryInfo.Current.FullName, '.vscode'))
    }

    private static get PoykaWorkSpace(): DirectoryInfo|null
    {
        const thisJsCodeFile = new FileInfo(__filename);
        return thisJsCodeFile.Directory.FindAncestor(d=>d.GetFiles().Any(f=>f.Name.toLowerCase() == 'package.json'));
    }

    private static EnsureWholeFileContentPublished(... fileNames: string[])
    {
        for(let fileName of fileNames)
        {
            // #region find destination
            // If it's not a project directory (doens't have .vscode dir) return
            if(this.VsCodeDir.Exists() === false) return;
            const destinationPath = path.join(this.VsCodeDir.FullName, fileName);        
            if(new FileInfo(destinationPath).Exists()) return;
            // #endregion

            // #region find source
                const sourceFile = new FileInfo(path.join(this.PoykaWorkSpace!.FullName, 'contents', fileName));  
            // #endregion
            
            sourceFile.CopyTo(destinationPath);
        }
    }

    // private static EnsureGSnippetsPublished()
    // {
    //     // #region find destination
    //         // If it's not a project directory (doens't have .vscode dir) return
    //         if(this.VsCodeDir.Exists() === false) return;
    //         const destinationPath = path.join(this.VsCodeDir.FullName, CommonFileName.decovaSnippets);        
    //         if(new FileInfo(destinationPath).Exists()) return;
    //     // #endregion

    //     // #region find source
    //         const sourceFile = new FileInfo(path.join(this.PoykaWorkSpace!.FullName, 'contents', CommonFileName.decovaSnippets));  
    //     // #endregion

    //     sourceFile.CopyTo(destinationPath);
    // }

    // public static EnsureDecovaSettingsPublished()
    // {
    //     // #region find destination
    //         // If it's not a project directory (doens't have .vscode dir) return
    //         if(this.VsCodeDir.Exists() === false) return;
    //         const destinationPath = path.join(this.VsCodeDir.FullName, CommonFileName.decovaSettings);        
    //         if(new FileInfo(destinationPath).Exists()) return;
    //     // #endregion

    //     // #region find source
    //         const sourceFile = new FileInfo(path.join(this.PoykaWorkSpace!.FullName, 'contents', CommonFileName.decovaSnippets));  
    //     // #endregion

    //     sourceFile.CopyTo(destinationPath);
    // }

    private static EnsureTasksPublished()
    {
        
    }

    // public static EnsureWorkspaceAugmented()
    // {
    //     this.EnsureWholeFileContentPublished(CommonFileName.decovaSettings, 
    //                                          CommonFileName.decovaSnippets);

    //     this.EnsureTasksPublished();
    // }
}