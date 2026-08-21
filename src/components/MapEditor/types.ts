export type Waypoint = {
  id: string
  x: number
  y: number
  name: string
  type?: string
  content?: string
  link?: string
  linkText?: string
  image?: string
}

export type ImageMapValue = { waypoints?: Waypoint[] }

export type MapImage = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}
