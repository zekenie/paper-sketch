import { Position, Toaster } from "@blueprintjs/core";
 
export const toaster = Toaster.create({
    className: "my-toaster",
    position: Position.BOTTOM_LEFT,
    container: document.body,
});