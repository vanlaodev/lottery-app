class Sound {
    constructor(path) {
        this.audio = new Audio(path);
    }

    waitUntilEvent(eventType) {
        return new Promise((resolve) => {
            const cb = () => {
                this.audio.removeEventListener(eventType, cb);
                resolve(this);
            };
            this.audio.addEventListener(eventType, cb);
        });
    }

    async waitUntilPlayable(canPlayThrough) {
        if (!canPlayThrough && this.audio.readyState == HTMLMediaElement.HAVE_FUTURE_DATA) return true;
        else if (canPlayThrough && this.audio.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA) return true;
        return await this.waitUntilEvent(canPlayThrough ? "canplaythrough" : "canplay");
    }

    waitUntilEnded() {
        return this.waitUntilEvent("ended");
    }

    async play() {
        await this.audio.play();
        return this;
    }

    stop() {
        this.pause();
        this.audio.currentTime = 0;
    }

    pause() {
        this.audio.pause();
    }
}

class SoundManager {
    constructor() {
        this.presetSoundPaths = {
            taDa: require('@/assets/TaDa.mp3'),
            drumRoll: require('@/assets/DrumRoll.mp3'),
        };
    }

    createSound(path) {
        return new Sound(path);
    }

    getPresetSound(key) {
        return this.createSound(this.presetSoundPaths[key]);
    }

    get taDa() {
        return this.getPresetSound("taDa");
    }

    get drumRoll() {
        return this.getPresetSound("drumRoll");
    }
}

export default new SoundManager();