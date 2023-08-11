class BUZZER
{
    #isPlaying = false;
    constructor()
    {
        const browserAudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new browserAudioContext();

        this.gainNode = this.audioContext.createGain();
        this.finishNode = this.audioContext.destination;

        // Connect gain to destination
        this.gainNode.connect(this.finishNode);

        // Set volume 5%
        this.gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);

    }

    setVolume(value = 5)
    {
        const volume = value / 100;

        if(this.gainNode)
            this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);        
    }

    play(frequency = 440)
    {
        if (this.audioContext && !this.#isPlaying) {
            this.oscillatorNode = this.audioContext.createOscillator();

            // Set the frequency
            this.oscillatorNode.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
            // Square wave
            this.oscillatorNode.type = 'square';
    
            // Connect the gain and start the sound
            this.oscillatorNode.connect(this.gainNode);
            this.oscillatorNode.start();

            this.#isPlaying = true;
        }
    }

    stop()
    {
        if (this.oscillatorNode && this.#isPlaying) {
            this.oscillatorNode.stop();
            this.oscillatorNode.disconnect();
            this.oscillatorNode = null;

            this.#isPlaying = false;
        }
    }
}

export default BUZZER;