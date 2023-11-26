import { NextResponse } from 'next/server';
import { issueCredential, sendCredential } from '../../../util/trinsic';

// https://docs.trinsic.id/examples/issue-direct-send/#issue-credential-from-template
export async function POST(request) {
    // Get handle from request body
    const { email, handle } = await request.json();
    // await setKey(handle, did)

    const documentCredential = await issueCredential({ email, handle });

    if (email) {
        await sendCredential(email, documentCredential);
    }

    return NextResponse.json(
        { credential: documentCredential },
        {
            status: 200,
        }
    );
}

export async function GET() {
    // get handle from query param

    const did = await getKey(handle);

    return NextResponse.json(
        { did },
        {
            status: 200,
        }
    );
}
