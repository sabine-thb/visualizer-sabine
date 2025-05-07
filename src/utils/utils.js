import jsmediatags from "jsmediatags/dist/jsmediatags.min.js";

export const fetchMetadata = async (TRACKS, tracks, setTracks) => {
  const promises = TRACKS.map(
    (track) =>
      new Promise((resolve, reject) => {
        const audio = new Audio(track.path);

        audio.addEventListener("loadedmetadata", () => {
          fetch(track.path)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${track.path}`);
              }
              return response.blob();
            })
            .then((blob) => {
              jsmediatags.read(blob, {
                onSuccess: (tag) => {
                  const { title, artist, album, picture } = tag.tags;

                  let cover = "https://placehold.co/600x400";
                  if (picture) {
                    const base64String = btoa(
                      picture.data.map((char) => String.fromCharCode(char)).join("")
                    );
                    cover = `data:${picture.format};base64,${base64String}`;
                  }

                  const fallbackArtist = track.artist || "Inconnu";
                  const _artists = artist
                    ? artist.split(",").map((a) => ({ name: a.trim() }))
                    : [{ name: fallbackArtist }];

                  resolve({
                    index: track.id,
                    name: track.name,
                    title: title || track.name,
                    duration: audio.duration,
                    artists: _artists,
                    album: {
                      cover_xl: cover,
                      title: album || "Unknown Album",
                    },
                    preview: track.path,
                  });
                },
                onError: (error) => {
                  console.error(`Error reading metadata for ${track.name}:`, error);

                  const fallbackArtist = track.artist || "Inconnu";

                  resolve({
                    index: track.id,
                    name: track.name,
                    title: track.name,
                    duration: audio.duration,
                    artists: [{ name: fallbackArtist }],
                    album: {
                      cover_xl: "https://placehold.co/600x400",
                      title: "Unknown Album",
                    },
                    preview: track.path,
                  });
                },
              });
            })
            .catch((error) => {
              console.error(`Failed to fetch ${track.name}:`, error);
              reject(error);
            });
        });
      })
  );

  try {
    const results = await Promise.all(promises);

    // Fusionner avec les tracks existants
    const _tracks = [...tracks, ...results];

    setTracks(_tracks);
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
};
