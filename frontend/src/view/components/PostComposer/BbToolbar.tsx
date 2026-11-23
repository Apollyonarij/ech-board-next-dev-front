import { cva } from 'class-variance-authority'
import { For } from 'solid-js'
import { IconButton } from '../IconButton'
import { useI18n } from '../../i18n'
import type { MessageKey } from '../../i18n/ru'

const rowVariants = cva(
  'flex w-full flex-wrap items-center gap-1.5 min-[900px]:w-auto min-[900px]:gap-2.5',
)

// Text samples are intentionally styled to preview the formatting they insert.
// Special BB tags use the compact visual labels requested for the toolbar.
const TEXT_LABEL: Record<string, string> = {
  b: 'B',
  i: 'I',
  u: 'U',
  o: 'O',
  s: 'S',
  sup: 'x²',
  sub: 'x₂',
  spoiler: '[---]',
  fold: '=v',
  url: '[123]',
  code: '<>',
  secret: '???',
}

const TEXT_STYLE: Record<string, string> = {
  b: 'font-sans text-[16px] font-black',
  i: 'font-serif text-[16px] font-semibold italic',
  u: 'text-[15px] font-semibold underline underline-offset-2',
  o: 'text-[15px] font-semibold overline',
  s: 'text-[15px] font-semibold line-through',
  sup: 'font-serif text-[15px] font-semibold',
  sub: 'font-serif text-[15px] font-semibold',
  spoiler: 'font-mono text-[10px] font-bold tracking-[-0.08em]',
  fold: 'font-mono text-[15px] font-bold',
  url: 'text-[11px] font-semibold',
  code: 'font-mono text-[18px] font-bold',
  secret: 'font-mono text-[12px] font-bold tracking-tight',
}

interface BbTag {
  tag: string
  titleKey: MessageKey
}

const BB_TAGS: BbTag[] = [
  { tag: 'b', titleKey: 'postForm.bold' },
  { tag: 'i', titleKey: 'postForm.italic' },
  { tag: 'u', titleKey: 'postForm.underline' },
  { tag: 'o', titleKey: 'postForm.overline' },
  { tag: 's', titleKey: 'postForm.strike' },
  { tag: 'sup', titleKey: 'postForm.sup' },
  { tag: 'sub', titleKey: 'postForm.sub' },
  { tag: 'spoiler', titleKey: 'postForm.spoiler' },
  { tag: 'fold', titleKey: 'postForm.fold' },
  { tag: 'url', titleKey: 'postForm.url' },
  { tag: 'code', titleKey: 'postForm.code' },
  { tag: 'secret', titleKey: 'postForm.secret' },
]

export function BbToolbar(props: { onInsertTag: (tag: string) => void }) {
  const { t } = useI18n()
  return (
    <div class={rowVariants()}>
      <For each={BB_TAGS}>
        {(btn) => (
          <IconButton
            size="md"
            title={t(btn.titleKey)}
            aria-label={t(btn.titleKey)}
            onClick={() => props.onInsertTag(btn.tag)}
          >
            <span
              aria-hidden="true"
              class={`grid size-6 place-items-center leading-none ${TEXT_STYLE[btn.tag] ?? 'font-mono text-sm font-bold'}`}
            >
              {btn.tag === 'sup' ? (
                <sup>sup</sup>
              ) : btn.tag === 'sub' ? (
                <sub>sub</sub>
              ) : btn.tag === 'spoiler' ? (
                '[---]'
              ) : (
                TEXT_LABEL[btn.tag] ?? btn.tag
              )}
            </span>
          </IconButton>
        )}
      </For>
    </div>
  )
}
