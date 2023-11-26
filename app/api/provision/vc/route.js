import { NextResponse } from 'next/server';
import { ISSUER_DID } from '../../issuer';

export async function POST(request) {
    // Get handle from request body
    const { handle, holderDid } = await request.json();
    const provisioned = true;
    const vc = await createVC(handle, ISSUER_DID, holderDid);
    const vp = await createVPfromVC(holderDid, vc);

    return NextResponse.json(
        { handle, vc, vp, provisioned },
        {
            status: 200,
        }
    );
}
