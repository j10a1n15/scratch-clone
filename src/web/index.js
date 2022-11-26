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
        const textLength = Number(getTextWidth(block.name, getCanvasFont()) + 10)
        const blockElement = document.createElement("li")
        blockElement.id = block.name
        blockElement.innerHTML = `<div class="block">
                                    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" width="100%" height="100%" viewBox='0 0 300 50'>
                                        <path fill="${await getColor(block.category)}" d="M 0 0 C 5.0003 0 9.9998 0 15 0 C 15 0 15 7.5 22.5 7.5 C 30 7.5 30 0 30 0 L 90 0 V 0 M ${textLength} 0 L ${textLength} 30 L 30 30 C 30 30 30 37.5 22.5 37.5 C 15 37.5 17.4998 32.4997 15 30 L 0 30 L 0 0 L 30 0"/>
                                        <text x="5" y="21">${block.name}</text>
                                    </svg>
                                </div>`
        //blockElement.innerHTML = `<div class="block" style="background-color: ${getColor(block.category)}; border-color: ${shadeColor(await getColor(block.category), -20)}; color: black;">${block.name}</div>`
        blockList.appendChild(blockElement)


        blockElement.addEventListener("click", () => {
            const block = blocks.find(block => block.name === blockElement.id)
            console.log(block)
        })
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

/**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  * 
  * @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  * 
  * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '12px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Arial';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
}