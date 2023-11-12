<br/>
<p align='center'>
    <img src='./public/logo.png' width=400 />
</p>
<br/>

Blockreach
---

Verified company reviews and communication using verified Web5 DID secure channels.


### Inspiration

Online partners and potential clients are constantly looking for ways to get in contact with a business or make themselves known. Blockreach addresses this need by enabling businesses to create their own secure contact pages, facilitating interactions via smart contracts managed through the Blockreach app. Furthermore, Blockreach enhances security by assigning Decentralized Identifiers (DIDs) and VCs to verified partners.

Accounts have an additional layer of security through Blockreach-issued DIDs and VCs for each verified partner on the app.

Blockreach serves as a bridge for secure B2B communication, ensuring that both parties can be confident they are contacting an authorized source. This assurance is achieved through Blockreach-issued verifiable credentials (VCs) and decentralized identifiers. Going after the Finance & Identity Intersection category.

## How it works

1. Pages on BlockReach are automatically generated from user's existing web profiles using <a href="https://www.lens.xyz/" target="_blank">Lens</a>.
2. Users can claim profiles using validated DIDs.
3. Once verified, company pages can be shared and posted against by public users.

## Running the project (from scratch)

1. Generate a new Zksync contract for Blockreach by calling `yarn; yarn deploy` from the contracts folder. This will deploy the paymaster contract for the app.

2. Copy `.env.sample` -> `.env`

3. Define the the fields to your desired management and paymaster contract address from (1) in `.env`.

4. `yarn; yarn dev`. The app should now be running on port 3000.

5. Go to `localhost:3000/admin`. Connect your wallet using the same address from step 3.

6. Update the `issuer` credential found in `issuer.js`

7. Provision keys for handles using this page.

Any repeated starts can be done with `yarn dev` once all variables set.

## Technologies used

Blockreach pulls information from LENS to create a verified profile page for the business with contact information using Onyx and LENS. Zero/low fee interactions with the verified business account interactions facilitated with a paymaster ZkSync that refunds gas fees.

1. Blockreach app has an admin issuer/verifier account that is run server side and used to validate new business page creations.
2. These server verifies all new page requests and generates unique DID and VC/VP keys that are saveable by each page owner.

 <p>Note this project is a hackathon prototype and would require additional work to be mainnet ready.</p>

## Challenges we ran into:

Verifiable Credential Issuance: It's critical that only legitimate businesses and individuals can register under a verified handle - this prompted creating a separate admin/issuer portal and due dilligence process managed with Onyx server side in order to prevent illegal claiming of profiles. The issued handle is embedded in the VC metadata and is cross checked and time of account claiming.

User Authentication/Verification: Implementing secure user authentication processes, especially for admin functions, required a high level of attention to detail to prevent unauthorized access.

Hackathon Time Constraints: As a prototype developed for a hackathon, there were time constraints that limited the depth of development and testing. This posed challenges in ensuring the platform's robustness.

## Accomplishments that we're proud of:

## What we learned:


### Deployment build

This project is currently deployed with vercel.

![Alt text](img/vercel.png)

### Screenshots

## Potential future work

Blockreach is an open source project and is deployed on testnet. To be mainnet ready, some final security-related changes would need to be done around contract verification and the hosted Onyx backend. Some other potential items include:

* Enhanced Security Measures: Implement advanced security features, such as multi-factor authentication and additional encryption layers, to fortify user data and interactions.
* Mainnet Deployment: Transition from the hackathon prototype to a fully functional and secure mainnet-ready platform for broader adoption.
* Integration with more identity and blockchain sources: Extend compatibility to multiple blockchains to provide users with options and flexibility when conducting verified transactions.
* Community Governance: Establish a governance model that empowers platform users to influence decision-making and ensure long-term sustainability between parties on the app.
* Incentives for use and reporting: Make it easy as possible to start generating leads on the application and tracking the performance of using a Blockreach page vs. traditional checks/fiat payments and public aggregator sites like Yellowpages.

### Useful links

* https://difhackathon.devpost.com/
* https://difhackathon.devpost.com/resources
* https://developer.tbd.website/api/web5-js/
* DID validator: https://didlint.ownyourdata.eu/