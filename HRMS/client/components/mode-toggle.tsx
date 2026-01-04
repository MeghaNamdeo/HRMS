import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative inline-flex h-9 w-20 items-center rounded-full
                transition-colors duration-500 focus-visible:outline-none 
                ${isDark ? "bg-slate-950 border border-slate-800" : "bg-slate-200 border border-slate-300"}
            `}
            aria-label="Toggle theme"
        >
            {/* Sun Icon (Visible in Light Mode - Left Side) */}
            <span
                className={`
                    absolute left-2.5 z-10 flex items-center justify-center transition-all duration-500
                    ${isDark ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}
                `}
            >
                <Sun className="h-5 w-5 text-orange-500 fill-orange-500" />
            </span>

            {/* Moon Icon (Visible in Dark Mode - Right Side) */}
            <span
                className={`
                    absolute right-2.5 z-10 flex items-center justify-center transition-all duration-500
                    ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}
                `}
            >
                <Moon className="h-4 w-4 text-slate-100 fill-slate-100" />
            </span>

            {/* Knob */}
            <span
                className={`
                    absolute top-1 z-20 h-7 w-7 rounded-full shadow-md transition-all duration-500 cubic-bezier(0.4, 0.0, 0.2, 1)
                    ${isDark
                        ? "left-1 bg-white"  // Left side (Dark Mode)
                        : "left-[3.2rem] bg-slate-900" // Right side (Light Mode)
                    }
                `}
            />

            {/* Stars decoration for dark mode */}
            <span className={`absolute right-8 top-2 h-0.5 w-0.5 rounded-full bg-white transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`} />
            <span className={`absolute right-6 bottom-2 h-1 w-1 rounded-full bg-white transition-opacity duration-500 ${isDark ? 'opacity-70' : 'opacity-0'}`} />
        </button>
    )
}
