export default {
  preferredLanguage: 'de,en-US;q=0.7,en;q=0.3',
  header: {
    listView: { headers: { Accept: 'application/vnd+de.dataelementhub.listview+json' } },
    updateItem: { headers: { 'Accept-Language': '' } },
    preferredLanguage: { headers: { 'Accept-Language': 'de,en-US;q=0.7,en;q=0.3' } },
    ignoreLanguage: { headers: { 'Accept-Language': '' } },
    ignoreAccept: { headers: { Accept: '' } },
    detailView: { headers: { Accept: 'application/vnd+de.dataelementhub.detailview+json' } }
  }
}
