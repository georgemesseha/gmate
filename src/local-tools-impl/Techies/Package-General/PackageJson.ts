import { Json } from "decova-json";
import 'decova-dotnet'
import { SemVersion } from "decova-dotnet";

// interface LooseObject {
//     [key: string]: any
// }

export class PackageJson
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
    public sourceMap: boolean = true;
    public inlineSourceMap: boolean = false;
    public outDir: string = '';
    public scripts: string[] = [];

    public get Scripts(): string[]
    {
        return this.scripts;
    }
    public files: string[] = [];
    public get Files(): string[]
    {
        return this.files;
    }
    public keywords: string[] = [];
    public get Keywords(): string[]
    {
        return this.keywords;
    }
    public dependencies: object = new Object();
    public get Dependencies(): Map<string, string>
    {
        return Map.FromObjectProps<string>(this.dependencies);
        // return Dictionary.FromObjectProps<string>(this.dependencies);
    }

    public HasAsDependency(depName: string)
    {
        return Object.getOwnPropertyNames(this.dependencies).xAny(p => p == depName) 
    }


    public bin: object = new Object();
    public get Bin(): Map<string, string>
    {
        return Map.FromObjectProps<string>(this.bin);
    }
    public devDependencies: object = new Object();
    public get DevDependencies(): Map<string, string>
    {
        return Map.FromObjectProps<string>(this.devDependencies);
    }

    public SaveAs(filePath: string)
    {
        const objToSave = { ...this };
        delete (objToSave as any).FilePath;
        Json.TrySave(filePath, objToSave, true, true);
    }

    public Save()
    {
        this.SaveAs(this.FilePath);
    }

    public IncrementVersionPatch(autoSave: boolean = false)
    {
        try 
        {
            const version = new SemVersion(this.version);
            version.Patch ++;
            this.version = version.Text;

            if(autoSave)
            {
                this.Save();
            }
        } 
        catch (err) 
        {
            console.log(err);
            throw err;
        }
    }
}
