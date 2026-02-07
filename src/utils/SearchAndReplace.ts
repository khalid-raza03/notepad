
import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Plugin, PluginKey } from '@tiptap/pm/state'


declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        searchAndReplace: {
            setSearchTerm: (searchTerm: string) => ReturnType
            setReplaceTerm: (replaceTerm: string) => ReturnType
            replace: () => ReturnType
            replaceAll: () => ReturnType
            clearSearch: () => ReturnType
        }
    }
}

interface SearchAndReplaceStorage {
    searchTerm: string,
    replaceTerm: string,
    results: { from: number; to: number }[]
}

export const SearchAndReplace = Extension.create<any, SearchAndReplaceStorage>({
    name: 'searchAndReplace',

    addStorage() {
        return {
            searchTerm: '',
            replaceTerm: '',
            results: [],
        }
    },

    addCommands() {
        return {
            setSearchTerm: (searchTerm: string) => ({ editor }) => {
                this.storage.searchTerm = searchTerm
                this.storage.results = []

                // Force update to recalculate decorations
                editor.view.dispatch(editor.state.tr.setMeta('searchTermChanged', true))

                return true
            },
            setReplaceTerm: (replaceTerm: string) => ({ }) => {
                this.storage.replaceTerm = replaceTerm
                return true
            },
            clearSearch: () => ({ editor }) => {
                this.storage.searchTerm = ''
                this.storage.replaceTerm = ''
                this.storage.results = []

                editor.view.dispatch(editor.state.tr.setMeta('searchTermChanged', true))

                return true
            },
            replace: () => ({ state, dispatch, editor }) => {
                const { searchTerm, replaceTerm, results } = this.storage
                const { selection } = state

                if (!searchTerm || results.length === 0) return false

                // Find the next result after the current selection
                // If results are sorted by position (which they naturally are from descendants traversal)
                let nextResult = results.find(r => r.from >= selection.from)

                // If no result after cursor, wrap around to first result
                if (!nextResult) {
                    nextResult = results[0]
                }

                if (!nextResult) return false

                if (dispatch) {
                    const { from, to } = nextResult
                    state.tr.insertText(replaceTerm, from, to)
                    dispatch(state.tr.insertText(replaceTerm, from, to))
                    // Editor update will trigger plugin apply -> recompute results
                }

                return true
            },
            replaceAll: () => ({ state, dispatch }) => {
                const { searchTerm, replaceTerm, results } = this.storage

                if (!searchTerm || results.length === 0) return false

                if (dispatch) {
                    let tr = state.tr;
                    // Iterate backwards to keep positions valid
                    // We use the cached results from storage which correspond to the *start* of this transaction
                    for (let i = results.length - 1; i >= 0; i--) {
                        const { from, to } = results[i];
                        tr.insertText(replaceTerm, from, to);
                    }
                    dispatch(tr);
                }

                return true
            },
        }
    },

    addProseMirrorPlugins() {
        const extension = this;

        return [
            new Plugin({
                key: new PluginKey('searchAndReplace'),
                state: {
                    init() {
                        return DecorationSet.empty
                    },
                    apply(tr, oldSet) {
                        const { searchTerm } = extension.storage

                        // Recompute if doc changed or search term changed
                        if (!tr.docChanged && !tr.getMeta('searchTermChanged')) {
                            return oldSet.map(tr.mapping, tr.doc)
                        }

                        if (!searchTerm) {
                            extension.storage.results = []
                            return DecorationSet.empty
                        }

                        const newDecorations: Decoration[] = []
                        const newResults: { from: number, to: number }[] = []

                        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')

                        tr.doc.descendants((node, pos) => {
                            if (!node.isText) return

                            const nodeText = node.text || ''
                            let match

                            // Reset regex lastIndex just in case
                            regex.lastIndex = 0;

                            while ((match = regex.exec(nodeText)) !== null) {
                                const from = pos + match.index
                                const to = from + searchTerm.length

                                newResults.push({ from, to })
                                newDecorations.push(Decoration.inline(from, to, {
                                    class: 'search-result',
                                    style: 'background-color: yellow; color: black; border-bottom: 2px solid orange;',
                                    nodeName: 'span'
                                }))
                            }
                        })

                        extension.storage.results = newResults
                        return DecorationSet.create(tr.doc, newDecorations)
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state)
                    },
                },
            }),
        ]
    },
})
