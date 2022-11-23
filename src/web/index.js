let currentCategory = "motion"

handleBlocks()

async function handleBlocks() {
    const blocks = await getBlocks()

    const categories = Array.from(new Set(blocks.thing.map(block => block.category)))

    const sortedBlocks = categories.map(category => {
        return {
            category,
            blocks: blocks.thing.filter(block => block.category === category)
        }
    })

    displayCategories(categories, sortedBlocks)
    displayBlocks(sortedBlocks)
}

async function displayCategories(categories, sortedBlocks) {
    const ul = document.createElement("ul")
    const categoryList = document.getElementById("gui-editor-category")

    categoryList.appendChild(ul)

    categories.forEach(async category => {
        const categoryElement = document.createElement("li")
        categoryElement.id = category
        categoryElement.innerHTML = `${await createCircle(category)} <br> ${capitalizeFirstLetter(category)}`
        ul.appendChild(categoryElement)

        ul.lastChild.addEventListener("click", () => {
            if (currentCategory === category) return

            document.getElementById(currentCategory).classList.remove("active")
            currentCategory = category
            document.getElementById(currentCategory).classList.add("active")
            displayBlocks(sortedBlocks)
        })

        ul.children[0].classList.add("active")
    })
}

async function displayBlocks(sortedBlocks) {
    const blockElement = document.getElementById("gui-editor-blocks")
    const blockList = document.createElement("ul")
    const blocks = sortedBlocks.find(category => category.category === currentCategory).blocks

    blockElement.innerHTML = ""

    blockElement.appendChild(blockList)

    blocks.forEach(async block => {
        const blockElement = document.createElement("li")
        blockElement.id = block.name
        blockElement.innerHTML = `<div class="block" style="background-color: ${getColor(block.category)}; border-color: ${shadeColor(await getColor(block.category), -20)}; color: black;">${block.name}</div>`
        blockList.appendChild(blockElement)
    })

}

async function getColor(category) {
    const config = await getConfig()

    return config.categoryColor[category] || "#000000"
}

async function createCircle(category) {
    const categoryColor = await getColor(category)

    return `<svg width="30" height="30"><circle cx="15" cy="15" r="14" fill="${categoryColor}" stroke="${shadeColor(categoryColor, -60)}" stroke-width="2"/></svg>`
}

async function getBlocks() {
    return fetch("/database/blocks.json").then(res => res.json())
}

async function getConfig() {
    return fetch("/database/config.json").then(res => res.json())
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//https://stackoverflow.com/a/13532993
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}