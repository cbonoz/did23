'use client'

import ListingDetail from "../../lib/ListingDetail"
import React, { useState, useEffect } from "react"


export default function ListingPage({ params }) {
    const { listingId } = params

    return (
        <div>
            <ListingDetail listingId={listingId} />
        </div>
    )
}