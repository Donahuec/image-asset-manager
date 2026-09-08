# Image Asset Manager

A small svelte based UI for managing image display metadata stored in JSON files.

- Upload and parse a metadata json file
- Upload a folder of images that the metadata file is mapped for
- Edit the metadata in the UI
- Save the metadata back to a file

## JSON Metadata Format

```
{
  "images": {
    "flowerBasin": {
      "fileName": "flowerInTempleBasin",
      "formats": ["webp", "jpeg"],
      "alt": "Pink flowers in a stone basin of water",
      "title": "Flowers in Temple Basin",
      "description": "Pink flowers floating in a stone basin. This was taken at a temple in Japan.",
      "location": "Japan",
      "date": "2026"
    },
    "flowers": {
      "fileName": "flowers",
      "formats": ["jpeg"],
      "alt": "Cherry blossoms in front of a Japanese temple",
      "title": "Flowers in Front of a Temple",
      "description": "A picture of cherry blossoms starting to bloom, in front of a temple in Japan.",
      "location": "Japan",
      "date": "2026",
      "credit": "Cool Person Who Takes Photos"
    }
  }
}
```

## Running the Application

```
npm install
npm run dev
```
