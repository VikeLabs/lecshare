import { observable, action } from "mobx";

export class LecshareStore {
    @observable
    timestamp = 0;

    @observable
    class = ""

    @observable 
    lecture = 0

    @observable
    currentNanos = 0;

    @observable
    currentSeconds = 0;

    @action
    setTimestamp(newTime: number) {
        this.timestamp = newTime
    }

    @action
    setClass(newClass: string) {
        this.class = newClass
    }

    @action
    setLecture(newLecture: number) {
        this.lecture = newLecture
    }

    @action
    setNanos(newNanos:number) {
        this.currentNanos = newNanos
    }

    @action
    setSeconds(newSeconds:number) {
        this.currentSeconds = newSeconds;
    }
}