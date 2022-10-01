const { mouse, screen } = require('@nut-tree/nut-js')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const dialog = require('dialog-node')

let running = true;

dialog.question('Start', 'Edge Flipper', 0, start)

function start(code) {
    if (code == 0) {
        running = true;
        main();
    }
}

function stop() {
    running = false;
    dialog.question('Restart', 'Edge Flipper', 0, start)

}


async function main() {
    const screenWidth = await screen.width();
    const screenHeight = await screen.height();
    dialog.info('Stop', 'Edge Flipper', 0, stop)

    while (true) {
        if (!running) break;

        await sleep(0.1);
        const mousePosition = (await mouse.getPosition())
        const posX = mousePosition.x;
        const posY = mousePosition.y;
        const percentageX = Math.round(100 - ((screenWidth - posX) / screenWidth) * 100);
        const percentageY = Math.round(100 - ((screenHeight - posY) / screenHeight) * 100);


        if (percentageX >= 100 && (percentageY > 15 && percentageY < 80)) {
            const workspaceMoved = await shiftWorkspace('next');
            if (workspaceMoved) {
                await setMouseCursor(1);
            }
        }

        if (percentageX <= 0 && (percentageY > 15 && percentageY < 80)) {
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

    if (code == 'next' && nextWorkspace <= (totalNumberOfWorkspaces - 1)) {
        await exec(`wmctrl -s ${nextWorkspace}`);
        return true;
    }
    return false;
}