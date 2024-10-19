import { sanityClient } from "sanity:client";

export async function loadQuery({ query, params }) {
    const { result } = await sanityClient.fetch(query, params, { filterResponse: false });

    return {
        data: result,
    };
};