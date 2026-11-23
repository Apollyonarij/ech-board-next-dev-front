import { cva } from 'class-variance-authority'
import { Show } from 'solid-js'
import { useI18n } from '../i18n'
import { BoardsIcon } from '../icons/BoardsIcon'
import { SettingsIcon } from '../icons/SettingsIcon'
import { SquarePenIcon } from '../icons/SquarePenIcon'
import { IconButton } from './IconButton'

const tabsVariants = cva('fixed inset-x-0 bottom-0 z-tabbar flex items-end px-3 pt-4 pb-[max(16px,env(safe-area-inset-bottom,0px))] pointer-events-none')
const pillVariants = cva('mx-auto flex w-[min(68%,280px)] items-center justify-between rounded-full glass bg-glass1 p-2 pointer-events-auto')

export function TabBar(props: {
  boardsActive: boolean
  settingsActive: boolean
  onGoHome: () => void
  onOpenSettings: () => void
  onCompose?: () => void
}) {
  const { t } = useI18n()
  return (
    <nav data-tabs="" class={tabsVariants()}>
      <div class={pillVariants()}>
        <IconButton
          size="xl"
          variant={props.boardsActive ? 'glass' : undefined}
          onClick={props.onGoHome}
          aria-label={t('ui.boards')}
        >
          <BoardsIcon width={24} height={24} />
        </IconButton>
        <ShowCompose onCompose={props.onCompose} />
        <IconButton
          size="xl"
          variant={props.settingsActive ? 'glass' : undefined}
          onClick={props.onOpenSettings}
          aria-label={t('ui.settings')}
        >
          <SettingsIcon width={24} height={24} />
        </IconButton>
      </div>
    </nav>
  )
}

function ShowCompose(props: { onCompose?: () => void }) {
  const { t } = useI18n()
  return (
    <Show when={props.onCompose}>
      <IconButton size="xl" onClick={() => props.onCompose?.()} aria-label={t('ui.newThread')}>
        <SquarePenIcon width={24} height={24} />
      </IconButton>
    </Show>
  )
}
