import { NextResponse } from 'next/server';
import { verifyCredential } from '../../util/trinsic';

export async function POST(request) {
    // Get handle from request body
    const { credential, handle } = await request.json();
    let result;
    try {
        result = await verifyCredential(credential);
    } catch (e) {
        console.error('verifying credential', e);
        // Return nextjs server error
        return NextResponse.json({ error: e.details || e }, { status: 500 });
    }
    const verified = true;

    return NextResponse.json(
        { handle, verified, result },
        {
            status: 200,
        }
    );
}
