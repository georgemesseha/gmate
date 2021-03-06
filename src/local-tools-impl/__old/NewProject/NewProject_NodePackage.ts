import { CurrentTerminal as tr } from "decova-terminal";
import { InsideExistingProject_Any } from "../InsideExistingProject/InsideExistingProject_Any";
// import * as fs from "decova-filesystem";
// import path from "path";
// import ch from "chalk";
// import {CurrentTerminal as Terminal} from "decova-terminal";

export class NewProject_NodePackage
{
    public static async TakeControl()
    {
        await tr.InstructAsync("Make sure that you're currently in an empty directory where your project will live or cancel and restart there!");
        await tr.HintBeforeLaunchAsync("Press Enter to initialize package.json");
        tr.Exec("npm init");
        InsideExistingProject_Any._AddUnitTest();
    }
}
