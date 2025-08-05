import React, { useState } from 'react';
import ChordHelper from '../../resources/model/chordHelper';
import model from '../../resources/model/model';
import './ChordBox.scss';
//@ts-ignore
import Diagram from '@tombatossals/react-chords/lib/Chord';


interface ChordComponentProps {
    chord: string
}   

function ChordComponent(props: ChordComponentProps) {
    const chordInfo = ChordHelper.getChordInfoFromString(props.chord, model.settings.transpose)

    //@ts-ignore
    const chord = chordInfo?.diagrams?.[model.settings.chords]?.positions?.[0]

    const [diagramOpen, setDiagramOpen] = useState(false)

    return <span className='chord' onClick={()=>setDiagramOpen(!diagramOpen)}>
            {diagramOpen && ["guitar", "ukulele"].includes(model.settings.chords) && <div className="chord-chart">
                {chord?<Diagram
                    chord={chord}
                    instrument={
//@ts-ignore
                        {
                            "guitar":ChordHelper.instrumentGuitar,
                            "ukulele":ChordHelper.instrumentUkulele,
                        }[model.settings.chords]
                    }
                />:<span className='no-chord'>
                    😢    
                </span>}
            </div>}
            {chordInfo?.name||"ERR"}
        </span>
}

export default function ChordBoxComponent({ children }:{children: string}) {
    let string = children?.[0]
    if (typeof string !== "string") string = ""

    let chords = string.split(" ")

    return <span className='chord-box'>
        {chords.map((c: string) => {
            return <ChordComponent chord={c} />
        })}
    </span>

}