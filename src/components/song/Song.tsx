import model from "../../resources/model/model";
import { Song } from "../../resources/model/songHelper";
import LyricsComponent from "../lyrics/Lyrics";

import "./Song.scss";

export type SongComponentProps = {
    song: Song;
    columns?: number;
    fontSize?: number;
    trans?: number;
    transposeCapo?: boolean;
};

function SongComponent({ song, columns = 1, fontSize = 20, trans = 0, transposeCapo = false }: SongComponentProps) {
    let capo = (12 + song.capo - (transposeCapo ? trans : 0)) % 12;
    let displayCapo = !!capo || !!song.capo;

    return (
        <div id="song" style={{ fontSize: fontSize }}>
            <div id="song-head">
                <h1 className="title">{song.title}</h1>
                <h2 className="author">{song.author}</h2>
            </div>
            <div
                id="lyrics"
                className={"lyrics" + (!model.settings.lineBreak ? " no-line-break" : "")}
                style={{ columnCount: columns }}
            >
                {!!displayCapo && <div className="capo">Capo {capo}</div>}
                {song.verses?.map((verse, k) => {
                    return (
                        <div className="verse" key={k}>
                            <LyricsComponent name={verse.name}>{verse.lyrics}</LyricsComponent>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SongComponent;
