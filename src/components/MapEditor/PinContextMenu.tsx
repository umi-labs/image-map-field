import * as ContextMenu from '@radix-ui/react-context-menu'
import * as Tooltip from '@radix-ui/react-tooltip'
import type React from 'react'

export function PinContextMenu({
  waypoint,
  onEdit,
  onDelete,
  children,
}: {
  waypoint: { id: string; name: string; x: number; y: number }
  onEdit: () => void
  onDelete: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip.Root delayDuration={200}>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        </ContextMenu.Trigger>
        <ContextMenu.Content className="map-editor__context-menu">
          <ContextMenu.Item className="map-editor__context-menu-item" onSelect={onEdit}>
            Edit
          </ContextMenu.Item>
          <ContextMenu.Item
            className="map-editor__context-menu-item map-editor__context-menu-item--delete"
            onSelect={onDelete}
          >
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <Tooltip.Content className="map-editor__tooltip" side="top" align="center">
        <div style={{ fontWeight: 600 }}>{waypoint.name}</div>
        <div style={{ fontSize: '0.85em', opacity: 0.8 }}>Right click for options</div>
        <Tooltip.Arrow className="map-editor__tooltip-arrow" />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
