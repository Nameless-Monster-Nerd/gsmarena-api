import * as gsmarena from './index'

async function main() {
    const brands = await  gsmarena.glossary.get();

    console.log(brands);
}

main();
