export const state = () => ({
  treeItemId: -1,
  activeTreeItemUrn: ''
})

export const getters = {
  getItemId (state) {
    return state.treeItemId
  },
  getActiveTreeItemUrn (state) {
    return state.activeTreeItemUrn
  }
}

export const mutations = {
  changeActiveTreeItemUrn (state, urn) {
    state.activeTreeItemUrn = urn
  },
  generateItemId (state) {
    state.treeItemId = state.treeItemId + 1
  }
}
