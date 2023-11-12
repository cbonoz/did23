import { NextResponse } from "next/server";
import { createDid } from "../../../util/onyx";
import { sendCredential } from "../../../util/trinsic";
import { getKey, setKey } from "../../kv";

// https://docs.trinsic.id/examples/issue-direct-send/#issue-credential-from-template
export async function POST(request) {
    // Get handle from request body
    const { email, did, handle } = await request.json();
    await setKey(handle, did)

    if (email) {
        await sendCredential(email, did)
    }

    return NextResponse.json(
        { did },
        {
            status: 200,
        },
    );
}

export async function GET() {
    // get handle from query param

    const did = await getKey(handle)

    return NextResponse.json(
        { did },
        {
            status: 200,
        },
    );
}