import { Navigate, Outlet, useParams } from "react-router-dom"
import type { NoteProps } from "./App"

type NoteLayoutProps = {
    notes: NoteProps[]
}

export default function NoteLayout({ notes }: NoteLayoutProps) {
    const { id } = useParams()
    const note = notes.find(n => n.id === id)
    if (note == null) return <Navigate to="/" replace />

    return <Outlet context={note} />
}
