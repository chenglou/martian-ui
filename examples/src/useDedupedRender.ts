import { useEffect, useRef } from 'react'

/*
// Live demo: https://reactplayground.vercel.app/#N4IgLgziBcBmCGAbCBTANCAbrK1QEsA7AExQA8A6AK1xHwFsAHAewCcwACAQUcY9lbN6HADogKAeh6NqEMmIDcIwgxbsOAJRTwAxpwFDRIVtr2Llqtp2AcdJ+GBQbmzTgF9+g4WPt6AtMRCEjqI+CiEYOaEyjrMhBCcsRHwRCisHAC8HIE6AK704WAUAOYoYACiiCgFEQBCAJ4AksQAFD4ukSAAlEqESQkcgq6ZtvaOzq4tSWAphGk9ykNFJiRpLVq6RXbajpXVhS3SXQuEIBjSsmQwIBISHH4cceWYhbbwjGC5JhAcYAAWKA4RHwYHwSFszFyEUesA4AAZlLd7o9CM9XvgfrlUMRfsxRjtARAdADiLkqlpVqxEXcHkSSWSnOFSOkMUD4vhSBw-vASFUAMKhHQAazQHAA7n98MSgT9gTNQgAvFA4nk4kzFDGOEwqn4oF7QuKIeocAD6cR0KBNoriHHokIi1I4AGU8f9ASEpULxfhEIgOKhOG6IVDA3iAIz8Nh6tKiuYvdJ2kzKR0AJn9zEQuVBcQg0EdDzFrHeKLR0KIHCxKD5SEQACNdF7VRxGFmOAADWIhtts34A7IoRhM8I6Y3wVhF+qit2EDjwYg4ttPfVgbtgV190iD1Z9Ufj+DG5iwyvlWCwFBmQhIh5ECAcwnE5UMinM0WViuoLSwtdvD5fQFBxAHBQAZ41vG1DxLZdk0vO4ADF8FYAYIAzLN8BtVla1cAFEKEFAKEg14xR9P1plmDgABkAHkABUnRhf0ZkcDhEGYDUdAUX4i2FIhig4Uw-mbMILR7TdZz3Y0IFyYUIHwgAFTNMVQE8zz0b1fX7GZpQAMkGFA-AcTSBLbbleSrQUhW7aNWGNFZmS5NJ0HFSVpSQZD-SkoUZOdPExUBYofJBASg1QJIcWQzNs2iKLLHUDY9FFGxKydRjHMrT9XyU09z3cTxDAAcl8MA8ug8g1E4UgEDJfQoT0NCZ2kFoug4YBlA4CF4k4ABtTsIlFAM+XtMAAF0RiSlKWjhLpoLa-pOCXV4skazIAD5mtatr-TKAaQymQaOAAag4MMmqRBIkDw9sepXGUf0+bUOFrY0QmYSSTFnEheyxWdEDFfcfjhfCAE1ITeGdAnbfrBqmFbbAOo6um7WtW3+VlAmAwg8s4cKXl7QE23wWBEZQFixXWtqCY4XaQzhiMMjpjgUyamwkSummbqQX76h+MN8IGkgQTqjg4zSTj8GKUpELJjb+gzPCWOKFo8u26FiR5DVCF478UzyqaZw2tx1oNqKZpzLGH1Jckh3SLJKwAEUfQdiGfNZ5oiXX1uPLK9BaJaMlWlq9ba2AasirlVX5cylpsOlH0tyklo8JElnos6qjmCAICloiSGYMUKDnYhSzAcjNXCNY8o9YU8tFEziAjz1dY23S7pnX3-e9HO85MO0XiLkuEjL1hFcroVq7D0yBQbjgjbatxRU6ob3b1kwW44AAeYh8EwZblbAaBmqutw14kTft+UI3lFKqx+BDwW7Yd5VnaH2ATSZ9bZv9c2GWIZpRo-FBYAtEIGSRAjcOBIhqkIGogZJQ-B0qgQEcwyCJCga8b82N-x9lTmXDOuVhA6HeHdHi-AURGhRBadaLNTYkJtv-QBL8wFIlgBQPI44Fr8BNB7TKKkwA+yan7Nagdm5fFbvw-2UtyawhaDHC2ypmgsK+CsTgABCLIwDfRNQIX0YmXAVD0AcHVWCRYCjSK-lUH+xAFFsLdlLGe0956L2mu1JCZjGSUhGG3QRTcKamPpOY+RrClEcFUULEBTUV4iKcW1GR38AmKPYSYAAjrkYCYBdEMAMXEIx8ATEtFBAUMRXim6fz8XIyxgT2HqMQBI8BdxV4o1lBEPEzCKkRDyQwFATVvywGBBAAS2NiHBXlDgzOQig4mnaQU2xYCL7LzKCIkpsc3HMnPiANwbggA

// - onEvent captures the initial count of 0
// - onEvent is used to create scheduleRender
// - scheduleRender is inside handleClick, which is initalized and registered as event only _once_, on mount
// So the click will set the count to 1 forever, never more

// 2 solutions:
// - wrap onEvent in useCallback and put `count` in the dependency array, then add `onEvent` to the dependency array of useEffect
// - inside scheduleRender, use useRef to capture the latest version of onEvent

// First solution is bothersome. onEvent will contain LOTS of state logic; tracking each piece in dep array sucks. Plus useEffect will detach & re-attach `handleClick` every render here, which also sucks. So we go with the second solution

import React, { useState, useRef, useEffect } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  const onEvent = () => {
    setCount(count + 1) // stale. `count` is captured by closure and thus always 0. You can do `setCount(c => c + 1)` but this doesn't solve the `if` below
    if (count + 1 === 2) { // count + 1 is always 1. Condition never triggers
      console.log('Count changing to 2')
    }
  }

  const scheduleRender = useDedupedRender(onEvent)

  useEffect(() => {
    function handleClick() { scheduleRender() } // root of staleness
    window.addEventListener('click', handleClick)
    return () => { window.removeEventListener('click', handleClick) }
  }, [])

  return <div>Count: {count}</div>
}

export function useDedupedRender(f_) {
  const scheduledId = useRef(null)
  // uncomment this & see next comment to solve the staleness from capturing f only once
  // const f = useRef(f_)
  // f.current = f_
  useEffect(() => {
    return () => {
      if (scheduledId.current != null) cancelAnimationFrame(scheduledId.current)
    }
  }, [])

  const scheduleRender = () => {
    if (scheduledId.current != null) return

    scheduledId.current = requestAnimationFrame((time) => {
      scheduledId.current = null
      // turn this into f.current(time) to finish solving the staleness
      f_(time)
    })
  }

  return scheduleRender
}
*/
export function useDedupedRender(f_: (time: number) => void) {
  const scheduledId = useRef<number | null>(null)
  const f = useRef(f_)
  f.current = f_

  useEffect(() => {
    return () => {
      if (scheduledId.current != null) cancelAnimationFrame(scheduledId.current)
    }
  }, [])

  const scheduleRender = () => {
    if (scheduledId.current != null) return

    scheduledId.current = requestAnimationFrame((time) => {
      scheduledId.current = null
      f.current(time)
    })
  }

  return scheduleRender
}
