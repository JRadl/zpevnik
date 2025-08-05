import { lyricsToVerses, Song, versesToLyrics } from "./songHelper";

export interface Collection {
    id: string;
    title: string;
    songs: Song[];
    display: Boolean;
}

export default class CollectionHelper {
    //parse JSON string into collection object
    static parseCollectionFile(str: string): Collection {
        const collection = JSON.parse(str);
        for (let i = 0; i < collection.songs.length; i++) {
            collection.songs[i].verses = lyricsToVerses(collection.songs[i].lyrics);
            delete collection.songs[i].lyrics;
        }
        return collection;
    }

    //prompt user for file and return the collection object parsed from the file
    //@throws "File upload failed"
    static async loadCollectionFromFile() {
        const input = document.createElement("input");
        input.type = "file";
        input.click();
        await new Promise((r) => input.addEventListener("change", r, { once: true }));
        if (!input.files?.length) throw new Error("File upload failed.");
        const text = await input.files[0].text();
        return this.parseCollectionFile(text);
    }

    //download collection object as JSON file
    static downloadCollection(collection: Collection) {
        let collectionCopy = JSON.parse(JSON.stringify(collection));
        collectionCopy.songs.forEach((song: any) => {
            song.lyrics = versesToLyrics(song.verses);
            delete song.verses;
        });
        delete collectionCopy.display;
        const blob = new Blob([JSON.stringify(collectionCopy, null, "\t")], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${collectionCopy.title}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}
