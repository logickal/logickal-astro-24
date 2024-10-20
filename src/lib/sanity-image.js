import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "sanity:client";

const builder = imageUrlBuilder(sanityClient);

export default function urlFor(source) {
    return builder.image(source);
}