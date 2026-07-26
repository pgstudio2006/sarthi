import { Audio } from 'expo-av';

export type SoundKey = 'option' | 'domainComplete' | 'screeningComplete';

const sources: Record<SoundKey, any> = {
  option: require('../assets/sounds/click.wav'),
  domainComplete: require('../assets/sounds/domain-complete.wav'),
  screeningComplete: require('../assets/sounds/screening-complete.wav'),
};

let audioModeSet = false;
const soundCache: Partial<Record<SoundKey, Audio.Sound>> = {};

async function loadSound(key: SoundKey): Promise<Audio.Sound | undefined> {
  if (soundCache[key]) return soundCache[key];
  try {
    const { sound } = await Audio.Sound.createAsync(sources[key], { shouldPlay: false });
    soundCache[key] = sound;
    return sound;
  } catch {
    return undefined;
  }
}

export async function initSounds(): Promise<void> {
  if (!audioModeSet) {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
      audioModeSet = true;
    } catch {
      // Ignore audio mode errors.
    }
  }
  await Promise.all(
    (Object.keys(sources) as SoundKey[]).map((key) =>
      loadSound(key).catch(() => undefined)
    )
  );
}

export function playSound(key: SoundKey): void {
  loadSound(key)
    .then((sound) => {
      if (!sound) return;
      sound.setPositionAsync(0).catch(() => {});
      sound.playAsync().catch(() => {});
    })
    .catch(() => {});
}
