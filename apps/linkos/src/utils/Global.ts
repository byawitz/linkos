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

    static ParseOrValue(last_id: any, value = 0) {
        try {
            const val = parseInt(last_id);
            if (!isNaN(val)) {
                return val;
            }
        } catch {
        }

        return value;
    }

    public static paginationObject(items: any, paginationSize: number, last_id: number) {
        let hasPrev = last_id !== 0;
        let hasNext = false;

        if (items.length > paginationSize) {
            hasNext = true;
            items.pop();
        }

        return {
            size: paginationSize,
            hasPrev,
            hasNext,
            items
        }
    }
}