import { cva } from 'class-variance-authority'
import { createEffect, For, onCleanup, Show } from 'solid-js'
import { canBoardSettings } from '../../model/rules/permissions'
import { useBoardInfo, useForumController, useLoadingMore, useThreadIds } from '../bindings/forum'
import { useIsMobile } from '../components/Gallery/useIsMobile'
import { DropdownMenu, type MenuItem } from '../components/Menu/DropdownMenu'
import { PageHeader } from '../components/PageHeader'
import { TabBar } from '../components/TabBar'
import { ThreadPreview } from '../components/ThreadPreview'
import { PostComposer } from '../components/PostComposer/PostComposer'
import { openMobileComposer } from '../composerVisibility'
import { useEntityActions } from '../entityActions'
import { useI18n } from '../i18n'
import { useMobileTabs } from '../interactions/mobileNav'
import { useNav } from '../nav'

const pageVariants = cva('flex min-h-screen min-w-0 flex-col')
const screenVariants = cva('flex min-h-dvh flex-col')
const boardMenuTriggerVariants = cva('px-1 py-2 hover:bg-hover')
const listVariants = cva('px-6 pb-36 pt-4')
const listMobileVariants = cva('pl-[calc(1rem+env(safe-area-inset-left,0px))] pr-[calc(1.25rem+env(safe-area-inset-right,0px))] pb-[calc(var(--mobile-tab)+10rem)] pt-2.5')
const sentinelVariants = cva('h-px')
const moreVariants = cva('py-3 text-center text-md text-secondary')

export function BoardPage(props: { forumId: string; slug: string; heading: string; host?: string }) {
  const { t, showDeleted } = useI18n()
  const mobile = useIsMobile()
  const tabs = useMobileTabs()
  const rows = useThreadIds(showDeleted)
  const info = useBoardInfo()
  const loadingMore = useLoadingMore()
  const ea = useEntityActions()
  const store = useForumController()
  const nav = useNav()
  const compose = () => openMobileComposer()
  let sentinel: HTMLDivElement | undefined
  createEffect(() => {
    const board = info()
    if (!board || board.next === null) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void store.loadMoreThreads()
      },
      { rootMargin: '300px' },
    )
    observer.observe(sentinel!)
    onCleanup(() => observer.disconnect())
  })
  const boardMenu = () => {
    const items: MenuItem[] = []
    const board = info()
    if (!board) return items
    items.push({ label: t('mod.debug'), onClick: () => ea.openLogs('board', { kind: 'board', id: board.id }) })
    items.push({ label: t('mod.bans'), onClick: () => ea.openBans(t('mod.bans'), 'board', board.id) })
    items.push({ label: t('mod.moderators'), onClick: () => ea.openBoardModerators() })
    if (canBoardSettings(ea.roleKinds())) items.push({ label: t('mod.manageBoard'), onClick: () => ea.openBoardSettings() })
    return items
  }
  return (
    <section class={mobile() ? screenVariants() : pageVariants()}>
      <PageHeader
        title={props.heading}
        subtitle={props.host ?? ''}
        onBack={mobile() ? () => nav.back() : undefined}
        trailing={<DropdownMenu items={boardMenu()} triggerVariant="glass" class={boardMenuTriggerVariants()} />}
      />
      <div class={mobile() ? listMobileVariants() : listVariants()}>
        <For each={rows()}>
          {(id) => (
            <ThreadPreview
              id={id}
              forumId={props.forumId}
              slug={props.slug}
              onOpen={(number) => nav.navigate({ page: 'thread', forumId: props.forumId, slug: props.slug, threadNum: number })}
            />
          )}
        </For>
        <div ref={sentinel} class={sentinelVariants()} />
        <Show when={loadingMore()}>
          <div class={moreVariants()}>{t('common.loading')}</div>
        </Show>
      </div>
      <PostComposer mode="thread" slug={props.slug} />
      <Show when={mobile()}>
        <TabBar boardsActive settingsActive={false} onGoHome={tabs.goHome} onOpenSettings={tabs.openSettings} onCompose={compose} />
      </Show>
    </section>
  )
}
