import { randomBytes } from "crypto";

interface ResetTokenPayload {
    email: string;
    expiration: number;
}

const resetTokens = new Map<string, ResetTokenPayload>();

export const createResetToken = (email: string): string => {
    const token = randomBytes(32).toString("hex");
    resetTokens.set(token, {
        email,
        expiration: Date.now() + 10 * 60 * 1000, // 10 minutes
    });
    return token;
}
export const verifyResetToken = (token: string): string | null => {
    const payload = resetTokens.get(token);
    if (!payload) return null;
    if (Date.now() > payload.expiration) {
        resetTokens.delete(token);
        return null;
    }
    return payload.email;
}
export const consumeResetToken = (token: string): string | null => {
    const payload = resetTokens.get(token)
    if (!payload) return null;
    if (Date.now() > payload.expiration) {
        resetTokens.delete(token);
        return null;
    }
    const email = verifyResetToken(token);
    if (email) resetTokens.delete(token);
    return email;
}

export const cleanupExpiredTokens = () => {
    const now = Date.now();
    for (const [token, payload] of resetTokens.entries()) {
        if (now > payload.expiration) {
            resetTokens.delete(token);
        }
    }
};
setInterval(cleanupExpiredTokens, 5 * 60 * 1000);