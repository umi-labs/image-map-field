import * as DialogPrimitive from '@radix-ui/react-dialog'
import React from 'react'
import './WaypointSheet.scss'
import type { Waypoint } from './types.js'

export function WaypointSheet({
  open,
  onOpenChange,
  waypoint,
  onSave,
  onCancel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  waypoint: Waypoint
  onSave: (wp: Waypoint) => void
  onCancel: () => void
}) {
  const [formState, setFormState] = React.useState(waypoint)

  React.useEffect(() => {
    setFormState(waypoint)
  }, [waypoint])

  if (!formState) return null

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="waypoint-sheet__overlay" />
        <DialogPrimitive.Content className="waypoint-sheet__dialog">
          <DialogPrimitive.DialogTitle className="waypoint-sheet__header">
            Edit Waypoint
            <DialogPrimitive.Close asChild>
              <button aria-label="Close" className="waypoint-sheet__close">
                &times;
              </button>
            </DialogPrimitive.Close>
          </DialogPrimitive.DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSave(formState)
            }}
            className="waypoint-sheet__form"
          >
            <label>
              Name
              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
              />
              <p className="help-text" role="region" aria-live="polite">
                The name of the waypoint.
              </p>
            </label>

            <label>
              Content
              <textarea
                value={formState.content ?? ''}
                onChange={(e) => setFormState({ ...formState, content: e.target.value })}
              />
              <p className="help-text" role="region" aria-live="polite">
                Text shown on the waypoint.
              </p>
            </label>

            <label>
              Type
              <input
                type="text"
                value={formState.type ?? ''}
                onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                placeholder="Optional category / icon key"
              />
              <p className="help-text" role="region" aria-live="polite">
                Optional free-text category you can map to an icon on the frontend.
              </p>
            </label>

            <label>
              Link
              <input
                type="url"
                value={formState.link ?? ''}
                onChange={(e) => setFormState({ ...formState, link: e.target.value })}
              />
              <p className="help-text" role="region" aria-live="polite">
                Include the full URL (http:// or https://).
              </p>
            </label>

            <label>
              Link Text
              <input
                type="text"
                value={formState.linkText ?? ''}
                onChange={(e) => setFormState({ ...formState, linkText: e.target.value })}
              />
              <p className="help-text" role="region" aria-live="polite">
                Text for the link. Defaults to &ldquo;View More&rdquo; if blank.
              </p>
            </label>

            <label>
              Image
              <input
                type="text"
                value={formState.image ?? ''}
                onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                placeholder="Enter a URL or relative path"
              />
              <p className="help-text" role="region" aria-live="polite">
                Full URL or relative path (e.g. https://… or /media/image.jpg).
              </p>
            </label>

            <div className="waypoint-sheet__actions">
              <button type="submit" className="btn btn--primary">
                Save
              </button>
              <DialogPrimitive.Close asChild>
                <button type="button" className="btn btn--secondary" onClick={onCancel}>
                  Cancel
                </button>
              </DialogPrimitive.Close>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
