import * as Popover from '@radix-ui/react-popover'
import type React from 'react'

interface WaypointPopoverProps {
  open: boolean
  mode: 'add' | 'delete'
  onOpenChange: (open: boolean) => void
  onSaveName?: (name: string) => void
  onDelete?: () => void
  onCancel?: () => void
  nameValue?: string
  setNameValue?: (val: string) => void
  trigger?: React.ReactNode
}

export function WaypointPopover({
  open,
  mode,
  onOpenChange,
  onSaveName,
  onDelete,
  onCancel,
  nameValue = '',
  setNameValue,
  trigger,
}: WaypointPopoverProps) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Popover.Trigger asChild>{trigger}</Popover.Trigger>}
      <Popover.Content className="map-editor__popover-content" side="top" sideOffset={-10} alignOffset={0}>
        <div className="map-editor__popover-content-inner">
          {mode === 'add' ? (
            <>
              <p className="map-editor__popover-content-title">Add a new waypoint</p>
              <input
                type="text"
                className="map-editor__popover-input"
                value={nameValue}
                onChange={(e) => setNameValue?.(e.target.value)}
                placeholder="Enter waypoint name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onSaveName) onSaveName(nameValue)
                }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  className="map-editor__popover-button btn btn--size-medium btn--icon-style-without-border"
                  onClick={() => onSaveName?.(nameValue)}
                >
                  Save Waypoint
                </button>
                <Popover.Close asChild>
                  <button
                    type="button"
                    className="map-editor__popover-button btn btn--size-medium btn--icon-style-without-border"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                </Popover.Close>
              </div>
            </>
          ) : (
            <>
              <p className="map-editor__popover-content-title">Delete waypoint</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" className="map-editor__popover-button btn" onClick={onDelete}>
                  Delete Waypoint
                </button>
                <Popover.Close asChild>
                  <button type="button" className="map-editor__popover-button btn" onClick={onCancel}>
                    Cancel
                  </button>
                </Popover.Close>
              </div>
            </>
          )}
        </div>
        <Popover.Arrow className="map-editor__popover-arrow" />
      </Popover.Content>
    </Popover.Root>
  )
}
