import type { Artwork } from "../types/Artwork";

/**
 * L'API ne donne pas d'URL d'image : on la construit avec config.iiif_url
 * et image_id. Beaucoup d'œuvres ont image_id à null, on renvoie alors null.
 */
export function imageUrl(iiifUrl: string | null, imageId: string | null): string | null {
  if (!iiifUrl || !imageId) {
    return null;
  }
  const iiifPath = new URL(iiifUrl).pathname.replace(/\/+$/, "");
  return `${iiifPath}/${imageId}/full/843,/0/default.jpg`;
}

/** Le nom de l'artiste, ou une mention par défaut si l'API ne le donne pas. */
export function artistName(artwork: Artwork): string {
  return artwork.artist_title ?? "Artiste inconnu";
}
