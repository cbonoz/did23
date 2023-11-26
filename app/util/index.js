export function addMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() + numOfMinutes);
    return date;
}

export const abbreviate = (s, len) => (s ? `${s.substr(0, len || 6)}**` : '');

export const formatDate = (d) => {
    if (!(d instanceof Date)) {
        d = d ? new Date(d) : new Date();
    }
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
};

export const formatCurrency = (amount, symbol) => {
    if (amount === 0) {
        return 'Free';
    } else if (!amount) {
        return '';
    }
    return `${amount} ${symbol}`;
};

export const isAdminDID = (did) => {
    return true || did === process.env.NEXT_PUBLIC_ADMIN_DID;
};

export const listingUrl = (listingId) =>
    `${window.location.origin}/profile/${listingId}`;

export const convertCamelToHuman = (str) => {
    // Check if likely datetime timestamp ms
    if (str.length === 13) {
        return new Date(str).toLocaleDateString();
    }

    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (str) {
            return str.toUpperCase();
        })
        .replace(/_/g, ' ');
};

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const createJsonFile = (signload, fileName) => {
    const st = JSON.stringify(signload);
    const blob = new Blob([st], { type: 'application/json' });
    const fileData = new File([blob], fileName);
    return fileData;
};

export const col = (k, render) => ({
    title: capitalize(k).replaceAll('_', ' '),
    dataIndex: k,
    key: k,
    render,
});

export const isEmpty = (r) => {
    return !r || r.length === 0;
};

export const humanError = (err) => {
    // check response data
    let message;
    if (err?.response?.data?.error) {
        message =
            err.response.data.error ||
            err.response.data.message ||
            err.response.data;
    }
    if (!message) {
        message = err?.error || err?.message || err?.toString();
    }
    // check if not instance of string
    if (typeof message !== 'string') {
        message = 'Invalid request. Your payload may be incorrect';
    }

    if (message.indexOf('404') !== -1) {
        message = 'Entry not found. Do you have the correct url';
    } else if (message.indexOf('network changed') !== -1) {
        message = 'Network changed since page loaded, please refresh.';
    }
    return message;
};

export function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const formatListing = (listing) => {
    if (!listing) return {};
    return {
        ...listing,
        // shortAddress: abbreviate(listing.address),
        created_by: abbreviate(listing.created_by),
        created_at: formatDate(listing.created_at),
        verified: listing.verified ? 'Verified' : 'Unverified',
    };
};

// Function to generate a random review and rating for a given company
export function getRandomReview(companyName) {
    // Array of possible reviews and their corresponding positivity weights
    const reviews = [
        { text: 'Excellent with top-notch services!', weight: 0.8 },
        {
            text: 'Needs improvement in customer experience, but products are good.',
            weight: 0.6,
        },
        { text: "Mediocre experience, wouldn't recommend.", weight: 0.4 },
        { text: 'Outstanding service and high-quality products.', weight: 0.9 },
        { text: 'Average service, nothing special.', weight: 0.5 },
        { text: 'Worst experience ever, stay away!', weight: 0.2 },
        // Add more review texts and weights as needed
    ];

    // Generate a random review index based on the weighted values
    const weightedReviews = reviews.map((review) =>
        Array(Math.ceil(review.weight * 10)).fill(review)
    );
    const flattenedReviews = [].concat(...weightedReviews);
    const randomReviewIndex = Math.floor(
        Math.random() * flattenedReviews.length
    );
    const randomReviewObj = flattenedReviews[randomReviewIndex];

    // Generate a random rating between 1 and 5 based on the positivity weight
    const randomRating = Math.ceil(
        Math.random() * 2 + randomReviewObj.weight * 3
    ).toFixed(0);

    // Get the randomly selected review text
    const randomReview = randomReviewObj.text;

    // Format and return the result
    console.log('generate', randomReview, randomRating);
    return {
        message: randomReview,
        rating: randomRating,
    };
}
