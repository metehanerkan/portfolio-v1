
interface RateLimitConfig {
    windowMs: number;
    max: number;
}

const defaultConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 10, // IP başına 15 dakikada 10 istek
};

const store = new Map<string, number[]>();

export function checkRateLimit(ip: string, config: RateLimitConfig = defaultConfig): { success: boolean, reset?: number } {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    let attempts = store.get(ip) || [];
    // Süresi dolmuş kayıtları temizle
    attempts = attempts.filter(timestamp => timestamp > windowStart);

    if (attempts.length >= config.max) {
        const oldest = attempts[0];
        const resetTime = oldest + config.windowMs;
        return { success: false, reset: resetTime };
    }

    attempts.push(now);
    store.set(ip, attempts);

    // Basit temizlik (bellek şişmesini önlemek için)
    if (store.size > 1000) {
        store.clear(); // Çok dolarsa sıfırla (lambda zaten genellikle kısa ömürlüdür)
    }

    return { success: true };
}
