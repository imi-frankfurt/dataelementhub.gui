export const state = () => ({
  treeItemId: -1,
  activeTreeViewNode: ''
})

export const getters = {
  getItemId (state) {
    return state.treeItemId
  },
  getActiveTreeItemUrn (state) {
    return state.activeTreeViewNode.urn
  },
  getActiveTreeViewNode (state) {
    return state.activeTreeViewNode
  }
}

export const mutations = {
  changeActiveTreeViewNode (state, node) {
    state.activeTreeViewNode = node
  },
  generateItemId (state) {
    state.treeItemId = state.treeItemId + 1
  }
}
