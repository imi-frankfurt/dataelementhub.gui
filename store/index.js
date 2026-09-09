export const state = () => ({
  treeItemId: -1,
  activeTreeViewNode: { urn: '' },
  designation: ''
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
  },
  getDesignation (state) {
    return state.designation
  }
}

export const mutations = {
  changeActiveTreeViewNode (state, node) {
    state.activeTreeViewNode = node
  },
  deactivateCurrentActiveTreeViewNode (state) {
    state.activeTreeViewNode = { urn: '' }
  },
  generateItemId (state) {
    state.treeItemId = state.treeItemId + 1
  },
  setDesignation (state, value) {
    state.designation = value
  }
}
export const actions = {
  updateDesignation ({ commit }, value) {
    commit('setDesignation', value)
  }
}
