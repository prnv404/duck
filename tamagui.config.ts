import { config } from '@tamagui/config/v3'
import { createFont, createTamagui } from 'tamagui'

const bodyFont = createFont({
  family: 'System',
  size: config.fonts.body.size,
  lineHeight: config.fonts.body.lineHeight,
  weight: config.fonts.body.weight,
  letterSpacing: config.fonts.body.letterSpacing,
  face: {
    400: { normal: 'Nunito_400Regular' },
    600: { normal: 'Nunito_600SemiBold' },
    700: { normal: 'Nunito_700Bold' },
    800: { normal: 'Nunito_800ExtraBold' },
  },
})

const headingFont = createFont({
  family: 'System',
  size: config.fonts.heading.size,
  lineHeight: config.fonts.heading.lineHeight,
  weight: config.fonts.heading.weight,
  letterSpacing: config.fonts.heading.letterSpacing,
  face: {
    600: { normal: 'Nunito_600SemiBold' },
    700: { normal: 'Nunito_700Bold' },
    800: { normal: 'Nunito_800ExtraBold' },
  },
})

const appConfig = createTamagui({
  ...config,
  fonts: {
    ...config.fonts,
    body: bodyFont,
    heading: headingFont,
  },
})

export default appConfig

export type Conf = typeof appConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}