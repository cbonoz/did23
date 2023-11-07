import { NextResponse } from "next/server";
import { createDid } from "../../../util/onyx";

export async function POST(request) {
    // Get handle from request body
    const { handle, type } = await request.json();
    const did = await createDid(handle, type);

    return NextResponse.json(
        { did },
        {
            status: 200,
        },
    );
}