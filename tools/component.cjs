#!/bin/node

const path = require('path');
const fs = require('fs');

if (process.argv.length < 3) {
    console.log('Usage: component <ComponentNameInPascalCase> [subdir]');
    process.exit(1);
}

const PASCAL = process.argv[2];
const CAMEL = PASCAL.replace(/[A-Z]/, (symbol) => symbol.toLowerCase());
const KEBAB = CAMEL.replaceAll(/[A-Z]/g, (symbol) => '-' + symbol.toLowerCase());

console.log(`Creating component: ${PASCAL} (${CAMEL}, ${KEBAB})`);

//const SUBDIR = process.argv[3] ?? "misc";
const DIR = path.normalize(`${__dirname}/../src/components/${KEBAB}`);

fs.mkdir(DIR, {}, err => {
    if(err){
        console.log(err)
        process.exit(1)
    }
    console.log(`✅ Created directory ${DIR}`);
})

const TSX = `${DIR}/${PASCAL}.tsx`
fs.writeFile(TSX,
`import './${PASCAL}.scss'

export type ${PASCAL}ComponentProps = {}

function ${PASCAL}Component(props:${PASCAL}ComponentProps){
    const { } = props
    return <div className="${KEBAB}" >

    </div>
}

export default ${PASCAL}Component;
`,
    (err) => {
        if(err){
            console.log(err)
            process.exit(1)
        }
        console.log(`✅ Created file ${TSX}`)
    }
);


const SCSS = `${DIR}/${PASCAL}.scss`
fs.writeFile(SCSS,
`@import '@styles/Styles.scss';

.${KEBAB} {

}
`,
    (err) => {
        if(err){
            console.log(err)
            process.exit(1)
        }
        console.log(`✅ Created file ${SCSS}`)
    }
);


// const STORIES = `${DIR}/${PASCAL}.stories.tsx`
// const TITLE = `${process.argv[3]??"Components"}/${PASCAL}`
// fs.writeFile(STORIES,
// `import type { Meta, StoryObj } from '@storybook/react';

// import ${PASCAL}Component from './${PASCAL}'

// type Story = StoryObj<typeof ${PASCAL}Component>

// export const ${PASCAL}: Story = {
//     args: {
//     }
// }

// const meta: Meta<typeof ${PASCAL}Component> = {
//     title: \"${TITLE}\",
//     component: ${PASCAL}Component,
// };

// export default meta; 
// `,
//     (err) => {
//         if(err){
//             console.log(err)
//             process.exit(1)
//         }
//         console.log(`✅ Created file ${STORIES}`)
//     }
// );