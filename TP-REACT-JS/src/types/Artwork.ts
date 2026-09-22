/**
 * Champs de l'API Art Institute of Chicago utilisés dans le projet.
 * Documentation : https://api.artic.edu/docs/
 *
 * artist_title, date_display et image_id peuvent valoir null.
 */
export interface Artwork {
  id: number;
  title: string;
  artist_title: string | null;
  date_display: string | null;
  image_id: string | null;
}
