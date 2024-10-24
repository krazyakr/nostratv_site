export class CacheService {
    private cache: Map<string, { value: string, timestamp: number }> = new Map();
    private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

    constructor(private readonly refreshFunction: (key: string) => Promise<string>) {
        this.startAutoRefresh();
    }

    get(key: string): string | null {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }

        const currentTime = Date.now();
        if (currentTime - entry.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    set(key: string, value: string): void {
        const timestamp = Date.now();
        this.cache.set(key, { value, timestamp });
    }

    private async refresh(key: string): Promise<void> {
        const value = await this.refreshFunction(key);
        this.set(key, value);
    }

    private startAutoRefresh(): void {
        setInterval(async () => {
            const currentTime = Date.now();
            for (const [key, entry] of this.cache.entries()) {
                if (currentTime - entry.timestamp > this.CACHE_DURATION) {
                    await this.refresh(key);
                }
            }
        }, this.CACHE_DURATION);
    }
}