export type UserSettings = {
  sound: UserSoundSettings
}

export type UserSoundSettings = {
  seVolume: number
  bgmVolume: number
  hintNarrationVolume: number
  serifNarrationVolume: number
  narrationLanguage: 'en' | 'es'
}
