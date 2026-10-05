/**
 * audioEffects.js
 * Sintetizador Procedural de Efeitos Sonoros via Web Audio API Pura
 * Zero dependências externas, funciona 100% offline
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initFromStorage();
  }

  initFromStorage() {
    try {
      const saved = localStorage.getItem('anim_mna_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch (e) {
      this.isMuted = false;
    }
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('anim_mna_muted', String(this.isMuted));
    } catch (e) {}
    return this.isMuted;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, delay = 0) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch (err) {}
  }

  playClick() {
    this.playTone(800, 'triangle', 0.05, 0.08);
  }

  playCardPlay() {
    this.playTone(450, 'sine', 0.08, 0.12);
    this.playTone(650, 'triangle', 0.12, 0.09, 0.04);
  }

  playMoney() {
    this.playTone(987.77, 'sine', 0.1, 0.1);
    this.playTone(1318.51, 'triangle', 0.25, 0.12, 0.08);
  }

  playSharkAlert() {
    if (this.isMuted) return;
    // Tom dramático descendente de predador
    this.playTone(220, 'sawtooth', 0.25, 0.15);
    this.playTone(185, 'sawtooth', 0.35, 0.18, 0.2);
    this.playTone(164, 'sawtooth', 0.45, 0.2, 0.45);
  }

  playCadeApproved() {
    if (this.isMuted) return;
    // Acorde maior triunfante
    this.playTone(523.25, 'triangle', 0.2, 0.12); // C5
    this.playTone(659.25, 'triangle', 0.25, 0.12, 0.1); // E5
    this.playTone(783.99, 'triangle', 0.35, 0.14, 0.2); // G5
    this.playTone(1046.50, 'sine', 0.5, 0.15, 0.3); // C6
  }

  playCadeVeto() {
    if (this.isMuted) return;
    // Carimbo grave e dissonante
    this.playTone(180, 'square', 0.2, 0.15);
    this.playTone(135, 'sawtooth', 0.35, 0.18, 0.15);
  }

  playCrisis() {
    if (this.isMuted) return;
    // Sirene de alerta
    this.playTone(400, 'sawtooth', 0.2, 0.15);
    this.playTone(280, 'sawtooth', 0.2, 0.15, 0.22);
    this.playTone(400, 'sawtooth', 0.2, 0.15, 0.44);
  }

  playVictory() {
    if (this.isMuted) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.3, 0.12, idx * 0.12);
    });
  }
}

export const Sound = new SoundManager();
