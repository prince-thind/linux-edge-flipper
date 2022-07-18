const { mouse, screen } = require('@nut-tree/nut-js')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

main();

async function main() {
    console.log('started')
    const screenWidth = await screen.width();
    while (true) {
        await sleep(0.1);
        const pos = (await mouse.getPosition()).x;
        const percentage = Math.round(100 - ((screenWidth - pos) / screenWidth) * 100);

        if (percentage >= 100) {
            const workspaceMoved = await shiftWorkspace('next');
            if (workspaceMoved) {
                await setMouseCursor(1);
            }
        }

        if (percentage <= 0) {
            const workspaceMoved = await shiftWorkspace('previous');
            if (workspaceMoved) {
                await setMouseCursor(99);
            }
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
    const { stdout: wmctrlOutput } = await exec("wmctrl -d | grep -w '*'");
    const totalNumberOfWorkspaces = (await exec("wmctrl -d")).stdout.split("\n").length - 1;

    const currentWorkspace = Number(wmctrlOutput.slice(0, 1));
    const nextWorkspace = currentWorkspace + 1;
    const previousWorkspace = currentWorkspace - 1;


    if (code == 'previous' && previousWorkspace >= 0) {
        await exec(`wmctrl -s ${previousWorkspace}`);
        return true;
    }

    if (code == 'next' && nextWorkspace <= (totalNumberOfWorkspaces-1)) {
        await exec(`wmctrl -s ${nextWorkspace}`);
        return true;
    }
    return false;
}