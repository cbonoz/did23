import { SignatureType, TrinsicService } from "@trinsic/trinsic";


const TRINSIC_TOKEN = process.env.TRINSIC_TOKEN

const trinsic = new TrinsicService({
    authToken: TRINSIC_TOKEN,
});


// https://docs.trinsic.id/examples/issue-direct-send/#issue-credential-from-template
export const issueCredential = async (values) => {

    const issueResponse = await trinsic.credential().issueFromTemplate({
        // required
        templateId: "https://schema.trinsic.cloud/example/id-document",
        valuesJson: JSON.stringify(values),
        // optional
        signatureType: SignatureType.STANDARD, // or EXPERIMENTAL
        includeGovernance: true,
        expirationDate: "2032-07-03T10:12:00Z",
        saveCopy: false,
    });

    console.dir(JSON.parse(issueResponse.documentJson), { depth: null, });
    return issueResponse.documentJson;

}