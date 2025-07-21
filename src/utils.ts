export class ElapsedTime {
    constructor(private title: string, private start: number) {
    }

    static start(title: string) {
        return new ElapsedTime(title, performance.now())
    }

    end() {
        const end = performance.now();
        console.info(`${this.title} took ${end - this.start} milliseconds.`);
    }
}