import { useEffect, useState } from 'react'

type Artwork = {
  id: number
  title: string
  artist_title: string | null
  image_id: string | null
}

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [iiifUrl, setIiifUrl] = useState('')

  useEffect(() => {-
    fetch('https://api.artic.edu/api/v1/artworks?page=1&limit=24&fields=id,title,artist_title,date_display,image_id')
      .then((response) => response.json())
      .then((json) => {
        console.log(Object.keys(json.data[0]))
        setArtworks(json.data)
        setIiifUrl(json.config.iiif_url)
      })
  }, [])

  return (
    <>
      <h1>Oeuvres</h1>
      <ul>
        {artworks.map((artwork) => (
          <li key={artwork.id}>
            {artwork.image_id && (
              <img
                src={`${iiifUrl}/${artwork.image_id}`}
                alt={artwork.title}
                width="120"
              />
            )}
            {artwork.title} - {artwork.artist_title}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App