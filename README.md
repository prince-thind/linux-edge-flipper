# Linux Edge Flipper / Workspace Wrapper

This repository is a minimalistic utility that allows the user to wrap/flip workspaces when the user mouse overs the screen edge. Please keep in mind, this project is not optimised at all and relies on a loop that checks cursor position every couple of miliseconds. I do not know of a convinient event based API to check if cursor position is infact on edge. However, the memory footprint is pretty small/nil so you should be able to use it without any issues.

# Prerequisites

1. NodeJS and npm in your system

# How to use

1. clone the repo from github and cd into it.
2. install the pacakges: `npm i`
3. start the appliation and follow GUI promptis: `npm start`

# Notes

1. Workspace will not flip if you are the top/bottom edges of the screen- this is to prevent accidental flips while trying to close the close from top-right and using panel utilities from bottom-right or bottom-left.

# Todo

1. Find an event based API to detect mouse position to optimise this project.
2. Add coniguration options for users, such as activation only when a certain key is pressed.
3. publish on npm and find ways to integrate this with the actual cinnamon desktop environment or publish this as desktop independent project.
4. Compile the code to make it so it does not need nodeJS to run.

# FAQS

## But it is already there in X desktop environment

Yes, but it is not presnt in the Y desktop environment. For me this Y is cinnamon. I have used cinnamon for the majority of life and this is a crucial feature I find missing in cinnamon.

## BuT i uSe wInDoWs

Cool.
