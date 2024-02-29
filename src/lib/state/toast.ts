import { writable } from "svelte/store";

export enum Severity{
    INFO ,
    WARNING,
    ERROR ,
    SUCCESS 
}


interface Toast{
    message: string;
    severity: Severity;
    show: boolean;
    showTime?: number;
}


export const toast = writable<Toast | null>(null);

export const  setToast = (message: string, severity: Severity, showTime: number = 5000) => {
    toast.set({message, severity, show: true, showTime});
    setTimeout(() => {
        toast.set(null)
    }, showTime);
}   