import { SignatureType, TrinsicService } from "@trinsic/trinsic";
 
 
const TRINSIC_TOKEN = process.env.TRINSIC_AUTH_TOKEN
 
const trinsic = new TrinsicService({
    authToken: TRINSIC_TOKEN,
});
 
export const sendCredential = async (email, documentJson) => {
    await trinsic.credential().send({
        documentJson,
        email,
        sendNotification: true,
    });
}
 
 
// https://docs.trinsic.id/examples/issue-direct-send/#issue-credential-from-template
export const issueCredential = async (values) => {
    console.log('issue', TRINSIC_TOKEN, values)
 
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