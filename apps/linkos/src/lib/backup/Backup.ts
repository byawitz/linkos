import Log from "../../utils/Log.ts";

/**
 * App command:
 * Linkos --backup starting point
 */
export default class Backup {
    public static init(): null {
        Log.instructions('Starting Backup');
        return null;
    }
}