'use client'
import * as Tooltip from '@radix-ui/react-tooltip'
import { MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import './map-editor.scss'
import './WaypointSheet.scss'
import { PinContextMenu } from './PinContextMenu.js'
import type { ImageMapValue, MapImage, Waypoint } from './types.js'
import { WaypointPopover } from './WaypointPopover.js'
import { WaypointSheet } from './WaypointSheet.js'

type PopoverState = { mode: 'add'; x: number; y: number } | null

/**
 * The interactive editor. Purely controlled: it renders `value.waypoints` over
 * `image` and calls `onChange` with the next value on every add/edit/delete.
 * Persistence is the parent field's concern (Payload saves the field).
 */
export default function MapEditor({
  value = {},
  image,
  onChange,
}: {
  value?: ImageMapValue
  image: MapImage
  onChange: (next: ImageMapValue) => void
}) {
  const mapRef = useRef<HTMLImageElement>(null)
  const cursor = useMousePositionWithinDiv({ divRef: mapRef })
  const [waypoints, setWaypoints] = useState<Waypoint[]>(value.waypoints || [])
  const [popoverState, setPopoverState] = useState<PopoverState>(null)
  const [newWaypointName, setNewWaypointName] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingWaypoint, setEditingWaypoint] = useState<Waypoint | null>(null)

  useEffect(() => {
    setWaypoints(value.waypoints || [])
  }, [value.waypoints])

  const commit = (next: Waypoint[]) => {
    setWaypoints(next)
    onChange({ ...value, waypoints: next })
  }

  const handleClick = () => {
    if (cursor.x >= 0 && cursor.y >= 0 && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect()
      setPopoverState({
        mode: 'add',
        x: (cursor.x / rect.width) * 100,
        y: (cursor.y / rect.height) * 100,
      })
      setNewWaypointName('')
    }
  }

  const handleNameSubmit = (name: string) => {
    if (name.trim() && popoverState) {
      const newWaypoint: Waypoint = {
        id: `${popoverState.x.toFixed(2)}-${popoverState.y.toFixed(2)}-${waypoints.length}`,
        x: popoverState.x,
        y: popoverState.y,
        name,
      }
      commit([...waypoints, newWaypoint])
      setPopoverState(null)
      setNewWaypointName('')
    }
  }

  const handleEditWaypoint = (wp: Waypoint) => commit(waypoints.map((w) => (w.id === wp.id ? wp : w)))
  const handleRemoveWaypoint = (id: string) => commit(waypoints.filter((w) => w.id !== id))

  const cursorPercent = (axis: 'x' | 'y') => {
    if (!mapRef.current) return 0
    const rect = mapRef.current.getBoundingClientRect()
    const size = axis === 'x' ? rect.width : rect.height
    return cursor[axis] >= 0 ? Math.round((cursor[axis] / size) * 100) : 0
  }

  return (
    <Tooltip.Provider>
      <div className="map-editor">
        <div className="map-editor__header">
          <div className="map-editor__header-title">
            <h2>Map Editor</h2>
          </div>
          <div className="map-editor__header-actions">
            <div className="map-editor__waypoints">
              {waypoints.map((waypoint) => (
                <div key={waypoint.id} className="map-editor__waypoint">
                  <span>
                    {waypoint.name}: [{Math.round(waypoint.x)}%, {Math.round(waypoint.y)}%]
                  </span>
                  <button
                    type="button"
                    className="map-editor__remove"
                    onClick={() => handleRemoveWaypoint(waypoint.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="map-editor__image-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url || ''}
            alt={image.alt || ''}
            width={image.width || undefined}
            height={image.height || undefined}
            ref={mapRef}
            onClick={handleClick}
          />
          {waypoints.map((waypoint) => (
            <PinContextMenu
              key={waypoint.id}
              waypoint={waypoint}
              onEdit={() => {
                setEditingWaypoint(waypoint)
                setEditDialogOpen(true)
              }}
              onDelete={() => handleRemoveWaypoint(waypoint.id)}
            >
              <button
                type="button"
                className="map-editor__waypoint-dot"
                style={{ left: `${waypoint.x}%`, top: `${waypoint.y}%` }}
                aria-label={`Pin: ${waypoint.name}`}
              >
                <MapPin />
              </button>
            </PinContextMenu>
          ))}
          {popoverState?.mode === 'add' && (
            <WaypointPopover
              open={popoverState?.mode === 'add'}
              mode="add"
              onOpenChange={(open) => {
                if (!open) setPopoverState(null)
              }}
              nameValue={newWaypointName}
              setNameValue={setNewWaypointName}
              onSaveName={handleNameSubmit}
              onCancel={() => setPopoverState(null)}
              trigger={
                <div
                  style={{
                    position: 'absolute',
                    left: `${popoverState.x}%`,
                    top: `${popoverState.y}%`,
                    width: 1,
                    height: 1,
                    pointerEvents: 'none',
                  }}
                />
              }
            />
          )}
          {editingWaypoint && (
            <WaypointSheet
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              waypoint={editingWaypoint}
              onSave={(wp: Waypoint) => {
                handleEditWaypoint(wp)
                setEditDialogOpen(false)
              }}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
          <p className="map-editor__coordinates">
            [x: {cursorPercent('x')}%, y: {cursorPercent('y')}%]
          </p>
        </div>
      </div>
    </Tooltip.Provider>
  )
}

function useMousePositionWithinDiv({ divRef }: { divRef: React.RefObject<HTMLImageElement | null> }) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (divRef.current) {
        const rect = divRef.current.getBoundingClientRect()
        const x = ev.clientX - rect.left
        const y = ev.clientY - rect.top
        if (x >= 0 && y >= 0) setMousePosition({ x, y })
      }
    }
    const div = divRef.current
    if (div) {
      div.addEventListener('mousemove', updateMousePosition)
      div.addEventListener('click', updateMousePosition)
    }
    return () => {
      if (div) {
        div.removeEventListener('mousemove', updateMousePosition)
        div.removeEventListener('click', updateMousePosition)
      }
    }
  }, [divRef])
  return mousePosition
}
