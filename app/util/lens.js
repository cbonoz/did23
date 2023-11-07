

import { LensClient, production } from "@lens-protocol/client";

const lensClient = new LensClient({
    environment: production
});

export const getProfileById = (profileId) => {
    return lensClient.profile.fetch({ profileId })  // ex: '0x0635'
}

export const getProfileByHandle = async (handle) => {
    const profile = await lensClient.profile.fetch({
        handle,
    })

    const publications = await lensClient.publication.fetchAll({
        profileId: profile.id,
        commentsOfOrdering: 'DESC',
    })
    return {profile, publications: publications.items}
}

export const searchProfiles = (query, limit) => {
    return lensClient.search.profiles({
        query,
        limit: limit || 10
    })
}
