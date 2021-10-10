// import { ILocalTool } from "../LocalToolsDispatcher";

export abstract class AbstractLocalTool //extends ILocalTool
{
    abstract TakeControlAsync(args: string): Promise<void>;

    abstract GetHint(): string;

    abstract GetShortcut(): string;

}