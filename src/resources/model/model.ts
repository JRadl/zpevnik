import { Record, RecordSubscription } from "pocketbase";
import { getSongs } from "../api/song";
import { autoFit, getCurrentSongId, normalize } from "../helpers";
import {
    changeSessionSong,
    endSession,
    newSession,
    subscribeToSession,
    unsubscribeFromSession,
} from "../pocket/session";
import { Collection } from "./collectionHelper";
import { Song } from "./songHelper";

type id = string;

interface State {
    navigate: (str: string) => any;
    collections: Collection[];
    songs: Song[];
    settings: any;
    session: any;
}

class ZpevnikDataModel {
    updateCallbacks: (() => any)[] = [];
    state: State = {
        navigate: (to: string) => {},
        songs: [],
        collections: [],
        settings: {
            columns: 1,
            transpose: 0,
            fontSize: 20,
            lineBreak: true,

            darkMode: false,
            oledMode: false,
            compactMode: false,
            sortAlphabetically: true,
            swipeGesturesPrevNext: true,

            displayChords: true,
            chords: "guitar",
            transposeCapo: false,
            preferedScale: 0,

            favorites: [],
            showYTButton: false,
            showFavorites: false,
            showColumnsButton: true,
            showAutoFitButton: true,
            showFontSizeButton: false,
            showTranspositionButton: true,
            showRandomSongButton: true,
            showLineBreakButton: false,

            resetTranspositions: true,
            closeSidebarOnSongClickPC: false,
            displayNsfw: false,
            autofitIntervalDelay: 10,
            maxColumns: 3,
            separateFavorites: false,

            autofitOnSessionUpdate: false,
            autofitShowTitle: false,

            yeet: false,

            editorMode: "verses",
            secret: "ahoj",
            showEditButton: false,
        },
        session: {
            online: false,
            code: "",
            leader: false,
        },
    };

    //set update callback function
    addUpdateCallback(fn: () => void) {
        this.updateCallbacks.push(fn);
    }

    //call update callback function to notify listeners
    notifyListeners() {
        this.updateCallbacks.forEach((fn) => fn());
    }

    //update model properties
    setState(data: object) {
        this.state = { ...this.state, ...data };

        this.notifyListeners();
    }

    //update settings in state
    setSettings(settings: object) {
        this.setState({
            settings: {
                ...this.state.settings,
                ...settings,
            },
        });
        localStorage.setItem("settings", JSON.stringify(this.settings));
    }

    //on route change
    onRouteChanged() {
        if (this.state.settings.resetTranspositions) this.setSettings({ transpose: 0 });
    }

    //load songs from local storage, then attempt to load from server
    async loadCollections() {
        const ls = localStorage.getItem("collections");
        if (ls) {
            const collections = JSON.parse(ls);
            this.setState({ collections });
        }

        getSongs().then((res) => {
            this.addCollection({ id: "default", title: "Default", display: true, songs: res });
        });
    }

    //load settings from local storage
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem("settings") || "false");
        if (settings) this.setSettings(settings);
    }

    //load session data
    loadSession() {
        const session = JSON.parse(localStorage.getItem("session") || "false");
        if (session) this.setState({ session: session });
        if (this.state.session.online && !this.state.session.leader) {
            subscribeToSession(this.state.session.code, (e: RecordSubscription<Record>) =>
                this.onSessionUpdate(e),
            ).catch((err) => {
                this.leaveSession();
            });
        }
    }

    constructor() {
        this.loadSettings();
        this.loadCollections();
        this.loadSession();
    }

    //get settings
    get settings(): { [key: string]: any } {
        return this.state.settings;
    }

    setting(name: string) {
        return this.settings[name];
    }

    //get songs sorted and filtered depending on settings
    get songs() {
        const set = this.state.settings;
        const favorites: string[] = set.favorites || [];
        let songs: Song[] = [];
        this.state.collections.forEach((c) => {
            if (c.display) {
                songs = [...songs, ...c.songs];
            }
        });

        if (!set.displayNsfw) songs = songs.filter((s) => s.sfw);
        if (set.sortAlphabetically) songs = songs.sort((a, b) => a.title.localeCompare(b.title));
        if (set.showFavorites && !set.separateFavorites)
            songs = songs.sort((a, b) =>
                favorites.includes(b.id) ? (favorites.includes(a.id) ? 0 : 1) : favorites.includes(a.id) ? -1 : 0,
            );

        return songs;
    }

    get songCount() {
        return this.state.collections?.reduce((prev, curr) => prev + curr.songs?.length || 0, 0) || 0;
    }

    //get sorted song ids
    get songIDs(): id[] {
        return this.songs.map((song) => song.id);
    }

    //get songs whose title+author contain query string
    //strings are normalized
    searchSongs(query: string) {
        return this.songs.filter((s) => (normalize(s.title) + normalize(s.author)).includes(normalize(query)));
    }

    //get song by id from array of songs filtered acording to settings
    getSongById(id: id) {
        return this.songs.find((song) => song.id === id);
    }

    //get song by id in window URI
    get currentSong(): Song | undefined {
        let id = getCurrentSongId();
        return this.getSongById(id);
    }

    isFavorite(id: id) {
        const favorites: id[] = model.settings.favorites;
        return favorites.includes(id);
    }

    onSessionUpdate(event: RecordSubscription<Record>) {
        if (event.action === "update") this.state.navigate(event.record.song);
        if (event.action === "delete") this.leaveSession();
        if (this.settings.autofitOnSessionUpdate) this.autoFit();
    }

    async startSession() {
        newSession()
            .then((code) => {
                localStorage.setItem("session", JSON.stringify(this.state.session));
                this.setState({
                    session: {
                        code: code,
                        online: true,
                        leader: true,
                    },
                });
                localStorage.setItem("session", JSON.stringify(this.state.session));
            })
            .catch((err) => {
                alert("Error starting new session.");
            });
    }

    async joinSession() {
        const code = prompt("Session code:")?.toUpperCase();
        if (!code) return;
        subscribeToSession(code, (e: RecordSubscription<Record>) => this.onSessionUpdate(e))
            .then(() => {
                this.setState({
                    session: {
                        online: true,
                        leader: false,
                        code: code,
                    },
                });
                localStorage.setItem("session", JSON.stringify(this.state.session));
            })
            .catch((err) => {
                alert("Error joining session.");
            });
    }

    async broadcastSong() {
        changeSessionSong(this.state.session.code, getCurrentSongId()).catch((err) => {
            alert("Session error.");
        });
    }

    async leaveSession() {
        if (this.state.session.leader) {
            endSession(this.state.session.code);
        } else {
            unsubscribeFromSession();
        }

        this.setState({
            session: {
                online: false,
                leader: false,
                code: "",
            },
        });
        localStorage.setItem("session", JSON.stringify(this.state.session));
    }

    ////
    autoFit() {
        autoFit();
    }

    //* COLLECTIONS *//

    setCollections(collections: Collection[]) {
        this.setState({ collections });
        localStorage.setItem("collections", JSON.stringify(collections));
    }

    addCollection(collection: Collection) {
        const collections = [...this.state.collections].filter((c) => c.id !== collection.id);
        collections.push(collection);
        this.setCollections(collections);
    }

    toggleCollection(collectionId: string) {
        const collections = [...this.state.collections];
        if (!collections?.length) throw new Error("No collections");
        const index = collections.map((c) => c.id).indexOf(collectionId);
        if (index === -1) throw new Error("Collection not found");
        collections[index].display = !collections[index].display;
        this.setCollections(collections);
    }

    deleteCollection(collectionId: string) {
        const collections = [...this.state.collections].filter((c) => c.id !== collectionId);
        this.setCollections(collections);
    }
}

declare global {
    interface Window {
        model: any;
    }
}

const model = new ZpevnikDataModel();
window.model = model;
export default model;
