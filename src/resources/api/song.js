import model from "../model/model";
import { lyricsToVerses, versesToLyrics } from "../model/songHelper";
import { pocket } from "../pocket/pocket";

function mapSong(s) {
    return {
        id: s.id,
        title: s.title || "",
        author: s.author || "",
        capo: s.capo || 0,
        sfw: s.sfw || false,
        verses: lyricsToVerses(s.lyrics),
    };
}

export async function getSongbooks() {
    let res = JSON.parse(localStorage.getItem("zpevnik_songbooks"));

    try {
        res = pocket.collection("zpevnik_songbooks").getFullList(1000);
        localStorage.setItem("zpevnik_songbooks", JSON.stringify(res));
    } catch(error) {
        console.log(error);
    }

    return res;
}

export async function getSongs(songbook) {
    let res = JSON.parse(localStorage.getItem("zpevnik_songs"));

    try {
        res = await pocket.collection("zpevnik_songs").getFullList({
            filter: `songbook = ${songbook}`
        });
        res = res.map((s) => mapSong(s));
        localStorage.setItem("zpevnik_songs", JSON.stringify(res));
    } catch (error) {
        console.log(error);
    }

    return res;
}

export async function createSong(data) {
    let newData = { ...data, lyrics: versesToLyrics(data.verses) };
    delete newData.verses;
    const record = await pocket
        .collection("song")
        .create(newData)
        .catch((err) => {
            console.log(err);
            throw err;
        });
    await model.loadSongs();
    return record;
}

export async function modifySong(id, data) {
    let newData = { ...data, lyrics: versesToLyrics(data.verses) };
    delete newData.verses;
    const record = await pocket
        .collection("song")
        .update(id, { ...newData, secret: model.settings.secret })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    await model.loadSongs();
    return record;
}