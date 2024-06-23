import Markdown from 'markdown-to-jsx';
import model from '../../resources/model/model';
import './Lyrics.scss';
import ChordBoxComponent from '../chordBox/ChordBox';

const replacers = [
  {
    reg: /\\h{(.*?)}/g,
    fun: (str: string) => `<span class="hskip" style="width:${str.substring(3, str.length - 1)}"> </span>`
  },
  {
    reg: /\\hskip{(.*?)}/g,
    fun: (str: string) => `<span class="hskip" style="width:${str.substring(3, str.length - 1)}"> </span>`
  },
  {
    reg: "|:",
    fun: (x: any) => "𝄆"
  },
  {
    reg: ":|",
    fun: (x: any) => "𝄇"
  },
  {
    reg: /\[(.*?)\]/g,
    fun: (str: string) => model.settings.displayChords?"<chord>" + str.substring(1, str.length - 1) + "</chord>":""
  },
  {
    reg: /[Jj]ít/g,
    fun: (str: string) => model.state.settings.yeet ? (str[0]==="J"?"Yeet":"yeet") : str
  },
]

interface LyriscComponenetProps {
  children: string
  name: string
}

function LyricsComponent({ children = "", name = "" }: LyriscComponenetProps) {
  let text = (typeof children === "string") ? children : ""
  if (typeof name !== "string") name = ""

  replacers.forEach(r => text = text.replaceAll(r.reg, r.fun))

  const rows = text.split("\n")

  return <div className="chord-lyrics">
    
    {rows.map((row,key) => <div className={`lyrics-line ${row.includes("<chord>")?"has-chords":""}`}>
      {key===0&&<div className="verse-name">{name}</div>}
      <Markdown
        options={{
          overrides: {
            chord: {
              component: ChordBoxComponent
            },
          }
        }}
      >{row}</Markdown>
    </div>)}
  </div>
}

export default LyricsComponent