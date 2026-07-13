/* eslint-disable react-hooks/set-state-in-effect */
// "use client"

// import { useCallback, useEffect, useRef, useState } from "react"
// import { Moon, Sun } from "lucide-react"
// import { flushSync } from "react-dom"

// import { cn } from "@/lib/utils"

// interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
//   duration?: number
// }

// export const AnimatedThemeToggler = ({
//   className,
//   duration = 400,
//   ...props
// }: AnimatedThemeTogglerProps) => {
//   const [isDark, setIsDark] = useState(false)
//   const buttonRef = useRef<HTMLButtonElement>(null)

//   useEffect(() => {
//     const updateTheme = () => {
//       setIsDark(document.documentElement.classList.contains("dark"))
//     }

//     updateTheme()

//     const observer = new MutationObserver(updateTheme)
//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     })

//     return () => observer.disconnect()
//   }, [])

//   const toggleTheme = useCallback(async () => {
//     if (!buttonRef.current) return

//     await document.startViewTransition(() => {
//       flushSync(() => {
//         const newTheme = !isDark
//         setIsDark(newTheme)
//         document.documentElement.classList.toggle("dark")
//         localStorage.setItem("theme", newTheme ? "dark" : "light")
//       })
//     }).ready

//     const { top, left, width, height } =
//       buttonRef.current.getBoundingClientRect()
//     const x = left + width / 2
//     const y = top + height / 2
//     const maxRadius = Math.hypot(
//       Math.max(left, window.innerWidth - left),
//       Math.max(top, window.innerHeight - top)
//     )

//     document.documentElement.animate(
//       {
//         clipPath: [
//           `circle(0px at ${x}px ${y}px)`,
//           `circle(${maxRadius}px at ${x}px ${y}px)`,
//         ],
//       },
//       {
//         duration,
//         easing: "ease-in-out",
//         pseudoElement: "::view-transition-new(root)",
//       }
//     )
//   }, [isDark, duration])

//   return (
//     // <button
//     //   ref={buttonRef}
//     //   onClick={toggleTheme}
//     //   className={cn(className)}
//     //   {...props}
//     // >
//     //   {isDark ? <Sun /> : <Moon />}
//     //   <span className="sr-only">Toggle theme</span>
//     // </button>
//     <button
//       ref={buttonRef}
//       onClick={toggleTheme}
//       className={cn(
//         `
//   relative p-4 rounded-full
//   border duration-500
//   flex items-center justify-center
//   hover:cursor-pointer

//   bg-black/80 text-white border-slate-400
//   hover:bg-black/70

//   dark:bg-white dark:text-black dark:border-slate-400
//   dark:hover:bg-white/80
//   `,
//         className
//       )}
//       {...props}
//     >
//       {isDark ? (
//         <Sun size={18} />
//       ) : (
//         <Moon size={18} />
//       )}
//       <span className="sr-only">Toggle theme</span>
//     </button>

//   )
// }


"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { cn } from "@/lib/utils"

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  /* -------------------------------------------
   * APPLY SAVED THEME ON FIRST LOAD
   * ------------------------------------------- */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    } else {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    }

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  /* -------------------------------------------
   * TOGGLE THEME WITH VIEW TRANSITION
   * ------------------------------------------- */
  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark
        setIsDark(newTheme)

        document.documentElement.classList.toggle("dark", newTheme)
        localStorage.setItem("theme", newTheme ? "dark" : "light")
      })
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()

    const x = left + width / 2
    const y = top + height / 2

    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [isDark, duration])

  /* -------------------------------------------
   * BUTTON UI
   * ------------------------------------------- */
  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        `
    relative w-11 h-11 rounded-full
    border border-border
    transition-all duration-500
    flex items-center justify-center
    hover:cursor-pointer

    bg-white text-gray-900
    dark:bg-zinc-900 dark:text-yellow-400

    hover:scale-105
    `,
        className
      )}
      {...props}
    >
      {isDark ? <Sun size={22} /> : <Moon size={22} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
