async function retry(fn, maxAttempts = 3, delayMs = 500) {
    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            return await fn();
        } catch (err) {
            attempt++;
            if (attempt === maxAttempts) {
                console.error(`Retry failed after ${maxAttempts} attempts:`, err);
                return;
            }
            await new Promise(res => setTimeout(res, delayMs));
        }
    }
}

module.exports = {retry}
