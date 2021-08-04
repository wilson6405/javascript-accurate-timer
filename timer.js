export default class Timer {
    constructor() {
        this.timeout = 0;
        this.worker = null;
        this.ontick = () => {};
        this.ontimeout = () => {};
        this.onstop = () => {};
        this.onreset = () => {};
    }

    start(timeout) {
        this.timeout = timeout;

        if (this.worker) {
            console.warn("timer is ticking.");
            return;
        }

        this.worker = new Worker("timer-worker.js");
        this.worker.onmessage = ({ data }) => {
            let [action, ...param] = data;

            switch (action) {
                case "tick": {
                    let [elapsed] = param;
                    this.ontick(elapsed);
                    break;
                }

                case "timeout": {
                    let [elapsed] = param;
                    this.ontimeout(elapsed);
                    this.worker.terminate();
                    this.worker = null;
                    break;
                }

                case "stop": {
                    let [elapsed] = param;
                    this.onstop(elapsed);
                    this.worker.terminate();
                    this.worker = null;
                    break;
                }

                case "reset": {
                    let [newStartTime] = param;
                    this.onreset(newStartTime);
                    break;
                }
            }
        };

        this.worker.postMessage(["start", this.timeout]);
    }

    stop() {
        if (this.worker == null) {
            console.warn("timer is not exist.");
            return;
        }

        this.worker.postMessage(["stop"]);
    }

    reset(newTimeout) {
        if (this.worker == null) {
            console.warn("timer is not exist.");
            return;
        }

        this.worker.postMessage(["reset", newTimeout]);
    }
}