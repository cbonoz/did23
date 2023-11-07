import { NextResponse } from "next/server";
import { verifyVP } from "../../util/onyx";

export async function POST(request) {

    const {handle, presentation} = await request.json();
    let verified
    let error
    try {
        verified = await verifyVP(presentation, handle);
    } catch (e) {
        // log
        console.error('error verifying', e)
        verified = false;
        error = e.message
    }

    return NextResponse.json(
        { handle, verified, error },
        {
            status: 200,
        },
    );
}