const tick = 5/* ms */; // 200 HZ
let startTime = 0;
let currentTime = 0;
let requestTime = 0;
let elapsed = 0;
let tickID = -1;

self.onmessage = (e) => {
    let [action, ...param] = e.data;

    switch (action) {
        case "start": {
            let [timeout] = param;
            requestTime = timeout;
            startTime = performance.now();

            tickID = setInterval(() => {
                currentTime = performance.now();
                elapsed = parseFloat(currentTime) - parseFloat(startTime);

                self.postMessage(["tick", elapsed]);

                if ((requestTime && elapsed >= requestTime) || elapsed >= Number.MAX_SAFE_INTEGER) {
                    clearInterval(tickID);
                    self.postMessage(["timeout", elapsed]);
                }

            }, tick);

            break;
        }

        case "stop": {
            clearInterval(tickID);
            self.postMessage(["stop", elapsed]);
            break;
        }

        case "reset": {
            let [timeout] = param;

            if (timeout >= 0 && timeout != requestTime)
                requestTime = timeout;

            startTime = performance.now();
            self.postMessage(["reset", startTime]);
            break;
        }
    }
};