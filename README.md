<br/>
<p align='center'>
    <img src='https://i.ibb.co/8m2X4WG/logo.png' width=400 />
</p>
<br/>

VerifiedEntity
---

Verified company reviews using verified Web5 DID secure channels and decentralized web nodes.

### Inspiration

Online partners and potential clients are constantly looking for ways to get in contact with a business or make themselves known. VerifiedEntity addresses this need by enabling companies to create their own verified social review pages, facilitating interactions, and managing public reviews through VerifiedEntity-decentralized nodes. Furthermore, VerifiedEntity enhances security by assigning Decentralized Identifiers (DIDs) and VCs to verified partners.

Accounts have an additional layer of security through VerifiedEntity-issued DIDs and VCs for each verified partner on the app.

VerifiedEntity serves as a bridge for secure B2B communication, ensuring that both parties can be confident they are contacting an authorized source. This assurance is achieved through VerifiedEntity-issued credentials and decentralized identifiers.

## How it works

VerifiedEntity has an issuer that validates and provisions DID's on behalf of businesses.

1. Pages on VerifiedEntity are automatically generated from user or company's existing web profile using <a href="https://www.lens.xyz/" target="_blank">Lens</a>.
2. Users can claim profiles using validated DIDs provisioned from a VerifiedEntity admin specified by Trinsic. Profiles are validated via verified credential exchange with the Trinsic sdk.
3. The validation state is saved on DWN nodes via the TBD sdk.
4. Once verified, verified pages can be shared and reviewed by public website users.
5. Reviews are saved using DWN nodes via TBD sdk.
6. The social activity of the profile is also integrated into the app.


<img src="./img/issuer.png" width=600 />

The rough flow is above. Taken from: https://docs.trinsic.id/guide/issuance/#interactive-issuance


## Running the project (from scratch)

1. Specify an admin DID

2. Copy `.env.sample` -> `.env`

3. Define the fields to your desired management and paymaster contract address from (1) in `.env`.

4. `yarn; yarn dev`. The app should now be running on port 3000.

5. Go to `localhost:3000/admin`. Connect your wallet using the same address from step 3.

6. Update the `issuer` credential found in `issuer.js`

7. Provision keys for handles using this page.

Any repeated starts can be done with `yarn dev` once all variables set.

## Technologies used

VerifiedEntity pulls information from LENS to create a verified profile page for the business with contact information using TBD, Trinsic, and LENS.

1. The VerifiedEntity app has an admin issuer/verifier account that runs on the server side and is used to validate new business page creations.
2. These server verifies all new page requests and generates unique DID and VC/VP keys that are saveable by each page owner.

* TBD: Used for DWN storage of reviews and profile/handle -> DID mappings.
* Web5.js for
* Trinsic used for VC/VP exchange.

 <p>Note this project is a hackathon prototype and would require additional work to be production ready.</p>

## Challenges we ran into:

Verifiable Credential Issuance: It's critical that only legitimate businesses and individuals can register under a verified handle - this prompted creating a separate admin/issuer portal and due dilligence process managed with Trinsic server side to prevent illegal claiming of profiles. The issued handle is embedded in the VC metadata and is cross-checked at the time of account claiming.

User Authentication/Verification: Implementing secure user authentication processes, especially for admin functions, required high attention to detail to prevent unauthorized access.

Hackathon Time Constraints: As a prototype developed for a hackathon, time constraints limited the depth of development and testing. Having limited time posed challenges in creating a memorable product within the timeframe.

### Screenshots

![Alt text](home.png)
![Alt text](tbd.png) ![Alt text](review.png) ![Alt text](profile.png) ![Alt text](activity.png) ![Alt text](search.png) ![Alt text](admin.png)

## Potential future work

* Enhanced Security Measures: Implement advanced security features, such as multi-factor authentication and additional encryption layers, to fortify user data and interactions.
* Integration with more identity and blockchain sources: Extend compatibility to multiple blockchains to provide users with options and flexibility when conducting verified transactions.
* Community Governance: Establish a governance model that empowers platform users to influence decision-making and ensure long-term sustainability between parties on the app.
* Incentives for use and reporting: Make it easy to generate leads on the application and track the performance of using a VerifiedEntity page vs. traditional review sites like Yelp.

### Useful links

* https://difhackathon.devpost.com/
* https://difhackathon.devpost.com/resources
* https://developer.tbd.website/api/web5-js/
* DID validator: https://didlint.ownyourdata.eu/
