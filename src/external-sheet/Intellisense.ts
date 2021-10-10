import { CurrentTerminal as Terminal } from "decova-terminal";
import * as inquirer from "inquirer"

type DlgTextRepresenter<TOption> = (option:TOption)=>string


export class Intellisense<TOption>
{
    private _plainOptions: string[] = [];

    constructor(private _options: TOption[], 
                private _displaySelector:DlgTextRepresenter<TOption>)
    {
        // if(this._options.constructor != List)
        // {
        //     this._options = new List<TOption>(this._options as TOption[]);
        // }
        this._plainOptions = this._options.xSelect(op => this._displaySelector(op as TOption)).xWhere(display => !!display);
    }

    private FilterOptions(options:string[], searchString: string): string[]
    {
        if(!searchString) return options;
        const keys = searchString.split(" ").xSelect(s => s.trim().toLowerCase())
        const output = options.xWhere(op => keys.xAll(k => op.toLowerCase().indexOf(k) >= 0));
        return output;
    }

    private async PromptPlainAsync(prompt: string): Promise<string>
    {
        inquirer.registerPrompt
        (
            'autocomplete',
            require('inquirer-autocomplete-prompt')
        );
        
        const answer = await inquirer.prompt
        ([
            {
                type: 'autocomplete',
                name: 'desc',
                pageSize: 20,
                message: prompt,
                source: (answersSoFar:string[], input:string) => 
                {
                    return this.FilterOptions(this._plainOptions, input);
                }
            }
        ]);

        return answer['desc'];
    }


    public async PromptAsync(prompt: string): Promise<TOption>
    {
        const selectedPlain = await(this.PromptPlainAsync(prompt));
        return this._options.xFirst(op => this._displaySelector(op) == selectedPlain);
    }
}
