import { Song } from "./songHelper";

export interface Collection {
    id: string;
    title: string;
    songs: Song[];
    display: Boolean;
}

export default class CollectionHelper {
    //parse JSON string into collection object
    static parseCollectionFile(str: string): Collection {
        return JSON.parse(str);
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
}
