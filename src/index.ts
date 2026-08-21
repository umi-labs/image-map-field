import type { Field, GroupField } from 'payload'
import deepMerge from './utilities/deepMerge.js'

export type { Waypoint } from './components/MapEditor/types.js'

type ImageMapOptions = {
  /** Group field name. Default `imageMap`. */
  name?: string
  /** Upload collection slug for the base image. Default `media`. */
  mediaSlug?: string
  /** Whether the base image is required. Default true. */
  required?: boolean
  overrides?: Partial<GroupField>
}

/**
 * A group field pairing a base image (upload) with a `map` JSON value holding
 * positioned waypoints. The `map` field renders an interactive editor: click
 * the image to drop a pin, right-click a pin to edit/delete. The value is
 * written straight to the field (persisted on save) — no custom endpoint.
 */
export const imageMap = ({
  name = 'imageMap',
  mediaSlug = 'media',
  required = true,
  overrides = {},
}: ImageMapOptions = {}): Field => {
  const result: GroupField = {
    name,
    label: 'Image Map',
    type: 'group',
    fields: [
      {
        name: 'image',
        label: 'Image',
        type: 'upload',
        relationTo: mediaSlug,
        required,
      },
      {
        name: 'map',
        label: 'Map',
        type: 'json',
        admin: {
          components: {
            Field: {
              path: '@foundrykit/image-map-field/client#ImageMapField',
              clientProps: { mediaSlug },
            },
          },
        },
      },
    ],
  }

  return deepMerge(result, overrides)
}

export default imageMap
