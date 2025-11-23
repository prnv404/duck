import { Button, ButtonProps } from 'tamagui'
import { PropsWithChildren } from 'react'

export type GameButtonProps = PropsWithChildren<
  ButtonProps & {
    bg?: string
    tone?: 'solid' | 'outline' | 'ghost'
    textColor?: string
    glow?: boolean
  }
>

function GameButton({ children, bg = '$green9', tone = 'solid', textColor, glow = true, ...rest }: GameButtonProps) {
  const isOutline = tone === 'outline'
  const isGhost = tone === 'ghost'
  return (
    <Button
      br="$10"
      backgroundColor={isOutline || isGhost ? 'transparent' : (bg as any)}
      borderWidth={isOutline ? 1 : 0}
      borderColor={isOutline ? (bg as any) : undefined}
      color={textColor}
      pressStyle={{ scale: 0.96 }}
      animation="bouncy"
      style={[
        glow
          ? {
              shadowColor: typeof bg === 'string' ? '#22c55e' : '#22c55e',
              shadowOpacity: 0.45,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
              elevation: 10,
            }
          : null,
      ]}
      {...rest}
    >
      {children}
    </Button>
  )
}

export { GameButton }
export default GameButton
