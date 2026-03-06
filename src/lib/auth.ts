import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'bb_fallback_secret_for_dev_only';

/**
 * Verifies the Bearer token in the Authorization header.
 * Returns { error: NextResponse } if invalid, or null if valid.
 */
export function requireAuth(req: Request): { error: NextResponse } | null {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        };
    }

    const token = authHeader.slice(7);
    try {
        jwt.verify(token, SECRET_KEY);
        return null; // valid
    } catch {
        return {
            error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        };
    }
}

/**
 * Sanitise error messages so internal stack traces are never sent to clients.
 */
export function safeErrorResponse(error: unknown, defaultMsg = 'Internal server error') {
    const msg = error instanceof Error ? error.message : defaultMsg;
    // Redact anything that looks like a file path or stack trace
    const safe = msg.replace(/([A-Za-z]:[\\/][^\s]+|\/[^\s]+)/g, '[path]').slice(0, 200);
    return NextResponse.json({ error: safe }, { status: 500 });
}
