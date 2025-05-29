import {track} from '@vercel/analytics';


export enum Events {
    drag_file_failed = "drag_file_failed",
    drag_file_success = "drag_file_success",
}

export enum Flags {
    drag_file = "drag_file"
}


export const triggerEvent = (event: Events, data?: Parameters<typeof track>[1], options?: Parameters<typeof track>[2]) => {
    if (!import.meta.env.PROD) {
        return
    }
    track(event, data, options);
}


