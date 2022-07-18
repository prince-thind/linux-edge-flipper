const { mouse, screen } = require('@nut-tree/nut-js')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

main();

async function main() {

    const screenWidth = await screen.width();
    while (true) {
        await sleep(0.1);
        const pos = (await mouse.getPosition()).x;
        const percentage = Math.round(100 - ((screenWidth - pos) / screenWidth) * 100);

        if (percentage >= 100) {
            await shiftWorkspace('next');
            await setMouseCursor(0.9);
        }

        if (percentage <= 0) {
            await shiftWorkspace('previous');
            await setMouseCursor(99.9);
        }
    }
}

async function setMouseCursor(percentage) {
    const screenWidth = await screen.width();
    const mouseY = (await mouse.getPosition()).y;
    const mouseX = Math.round(screenWidth * percentage / 100);
    mouse.setPosition({ x: mouseX, y: mouseY })
}

function sleep(n) {
    return new Promise(r => setTimeout(r, n * 1000))
}

async function shiftWorkspace(code) {
    const { stdout, stderr } = await exec("wmctrl -d | grep -w '*'");
    const currentWorkspace = Number(stdout.slice(0, 1));
    const nextWorkspace = Math.min(4, currentWorkspace + 1) + "";
    const previousWorkspace = Math.max(0, currentWorkspace - 1) + "";

    if (code == 'previous') {
        await exec(`wmctrl -s ${previousWorkspace}`);
    }

    if (code == 'next') {
        await exec(`wmctrl -s ${nextWorkspace}`);

    }
}