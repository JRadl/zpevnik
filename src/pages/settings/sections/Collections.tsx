import React from "react";
import { Toggle } from "../../../components/toggle";
import CollectionHelper, { Collection } from "../../../resources/model/collectionHelper";
import model from "../../../resources/model/model";

export default function CollectionsSettings() {
    const addCollection = async () => {
        const collection = await CollectionHelper.loadCollectionFromFile();
        console.log(collection);
        model.addCollection(collection);
    };
    const deleteCollection = () => {};
    const toggleCollection = () => {};

    const settings = model.settings;
    const collections: Collection[] = model.state.collections;
    return (
        <div className="section">
            <button onClick={addCollection}>Add</button>
            {collections.map((c, key) => (
                <CollectionComponent collection={c} key={key} />
            ))}
        </div>
    );
}

function CollectionComponent({ collection }: { collection: Collection }) {
    return (
        <div className="collection">
            <div className="left">
                <Toggle value={collection.display} onChange={() => model.toggleCollection(collection.id)} />
            </div>
            <div className="right">
                <div className="title">{collection.title}</div>
                <div className="id">{collection.id}</div>
            </div>
        </div>
    );
}
