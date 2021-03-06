import { List, XString } from "decova-dotnet-developer";
import { CurrentTerminal as Terminal } from "decova-terminal";
import * as inquirer from "inquirer"

type DlgTextRepresenter<TOption> = (option:TOption)=>string


export class Intellisense<TOption>
{
    private _plainOptions: string[] = [];

    constructor(private _options: List<TOption>|TOption[], 
                private _displaySelector:DlgTextRepresenter<TOption>)
    {
        if(this._options.constructor != List)
        {
            this._options = new List<TOption>(this._options as TOption[]);
        }
        this._plainOptions = this._options.Select(op => this._displaySelector(op)).Where(display => !!display).Items;
    }

    private FilterOptions(options:string[], searchString: string): string[]
    {
        if(new XString(searchString).IsNullOrWhiteSpace()) return options;
        const keys = new List<string>(searchString.split(" ")).Select(s => s.trim().toLowerCase())
        const output = new List<string>(options).Where(op => keys.All(k => op.toLowerCase().indexOf(k) >= 0)).Items;
        return output;
    }

    private async PromptPlainAsync(prompt: string): Promise<string>
    {
        inquirer.registerPrompt
        (
            'autocomplete',
            require('inquirer-autocomplete-prompt')
        );
        
        const answer = await inquirer
        .prompt
        ([
            {
                type: 'autocomplete',
                name: 'desc',
                pageSize: 10,
                message: prompt,
                source: (answersSoFar:string[], input:string) => 
                {
                    return this.FilterOptions(this._plainOptions, input)//.map(i=>({desc: i}))
                }
            }
        ]);

        return answer['desc'];
    }


    public async PromptAsync(prompt: string): Promise<TOption>
    {
        const selectedPlain = await(this.PromptPlainAsync(prompt))
        return (this._options as List<TOption>).First(op => this._displaySelector(op) == selectedPlain)
    }
}
