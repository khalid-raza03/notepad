import { useOutletContext } from "react-router-dom"
import type { NoteProps } from "./App"

export function useNote() {
    return useOutletContext<NoteProps>()
}
