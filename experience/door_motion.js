import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'

// Shared open/close motion for the landing doors. Both the Phoenix (swing) and
// the Orion (two-speed centre-opening slide) hang off the jamb-mounted call
// button: press it and the door runs exactly as it would in service.
//
// Neither door hard-codes its travel. The leaves are measured from their own
// geometry when the GLB loads, so a re-exported or mirrored model still hinges
// on the correct stile and still nests its slide panels at the right jamb.

/** Swing leaf: ~109°, far enough to clear the frame without folding the leaf
 *  back onto the landing wall. */
export const SWING_OPEN_ANGLE = 1.9

export const SWING_TWEEN = { duration: 1.1, ease: 'power2.inOut' }
export const SLIDE_TWEEN = { duration: 1.2, ease: 'power2.inOut' }

/**
 * Axis-aligned bounds of every mesh under `object`, expressed in that object's
 * own local space. `Box3.setFromObject` can't be used here: it measures in
 * world space, and these doors hang under the live scene rotation that
 * PresentationControls applies above them.
 */
export function localBounds(object) {
  const box = new THREE.Box3()
  if (!object) return box

  object.updateWorldMatrix(true, true)
  const toLocal = object.matrixWorld.clone().invert()
  const matrix = new THREE.Matrix4()

  object.traverse((child) => {
    if (!child.isMesh || !child.geometry) return
    if (!child.geometry.boundingBox) child.geometry.computeBoundingBox()
    matrix.multiplyMatrices(toLocal, child.matrixWorld)
    box.union(child.geometry.boundingBox.clone().applyMatrix4(matrix))
  })

  return box
}

/**
 * Open state plus the props to spread onto the call button. Pressing it toggles
 * the door; the pointer cursor is the only hint that the button is live.
 */
export function useCallButton() {
  const [open, setOpen] = useState(false)

  // A door hidden or swapped out while hovered would otherwise leave the
  // pointer cursor stuck on.
  useEffect(() => () => { document.body.style.cursor = '' }, [])

  const buttonProps = useMemo(() => ({
    onClick: (event) => {
      event.stopPropagation()
      setOpen((wasOpen) => !wasOpen)
    },
    onPointerOver: (event) => {
      event.stopPropagation()
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      document.body.style.cursor = ''
    },
  }), [])

  return [open, buttonProps]
}
