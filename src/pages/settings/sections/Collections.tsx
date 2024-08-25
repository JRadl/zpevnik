import React from "react";
import { FaCross, FaPlus, FaTimes } from "react-icons/fa";
import ButtonComponent from "../../../components/button/Button";
import { Toggle } from "../../../components/toggle";
import CollectionHelper, { Collection } from "../../../resources/model/collectionHelper";
import model from "../../../resources/model/model";

export default function CollectionsSettings() {
    const addCollection = async () => {
        const collection = await CollectionHelper.loadCollectionFromFile();
        console.log(collection);
        model.addCollection(collection);
    };

    const collections: Collection[] = model.state.collections;
    return (
        <div className="section">
            <ButtonComponent icon={<FaPlus />} onClick={addCollection}>
                Add
            </ButtonComponent>
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
            <div className="middle">
                <div className="title">{collection.title}</div>
                <div className="id">{collection.id}</div>
            </div>
            {collection.id !== "default" && (
                <div
                    className="right"
                    onClick={() => {
                        if (window.confirm("Do you really want to delete collection: " + collection.title))
                            model.deleteCollection(collection.id);
                    }}
                >
                    ×
                </div>
            )}
        </div>
    );
}
