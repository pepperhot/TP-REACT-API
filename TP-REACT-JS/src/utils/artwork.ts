import type { Artwork } from "../types/Artwork";

/**
 * L'API ne donne pas d'URL d'image : on la construit avec config.iiif_url
 * et image_id. Beaucoup d'œuvres ont image_id à null, on renvoie alors null.
 */
const IIIF_URL = "https://www.artic.edu/iiif/2";

export function imageUrl(imageId: string | null): string | null {
  if (!imageId) {
    return null;
  }
  return `${IIIF_URL}/${imageId}/full/400,/0/default.jpg`;
}

/** Le nom de l'artiste, ou une mention par défaut si l'API ne le donne pas. */
export function artistName(artwork: Artwork): string {
  return artwork.artist_title ?? "Artiste inconnu";
}
