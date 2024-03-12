export default class Global {
    public static async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    public static ParseOrFalse(json: string) {
        try {
            return JSON.parse(json);
        } catch {
            return false;
        }

    }
}