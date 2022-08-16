export default {
  global: {
    appName: 'DataElementHub',
    mainMenu: {
      home: 'Home',
      mainView: 'Hauptansicht',
      namespaces: 'Namespaces',
      dataElements: 'Data Elements',
      groups: 'Groups',
      records: 'Records',
      valueSets: 'Value Sets',
      workspace: {
        workspace: 'Workspace',
        staging: 'Staging',
        drafts: 'Drafts',
        validate: 'Validate'
      },
      view: {
        view: 'View',
        myData: 'My data',
        public: 'Public data',
        valueSets: 'Value Sets'
      },
      tools: {
        tools: 'Tools',
        namespaceComparison: 'Namespace Vergleich',
        mapping: 'Mapping',
        visualizer: 'Visualizer',
        importExport: 'Importieren / Exportieren',
        search: 'Suche'
      },
      settings: 'Einstellungen',
      about: 'App Informationen',
      help: 'Hilfe'
    },
    alerts: {
      warning: 'WARNUNG!',
      defineLanguage: 'Bevorzugte Sprache ist nicht definiert.'
    },
    button: {
      save: 'Speichern',
      cancel: 'Beenden',
      add: 'Hinzufügen',
      create: 'Erstellen',
      edit: 'Editieren',
      delete: 'Löschen',
      close: 'Schließen',
      showInTreeView: 'IM TREEVIEW ZEIGEN'
    },
    buttonTitle: {
      publicNamespace: 'Public namespaces sind für jeden frei zugänglich.',
      privateNamespace: 'Private namespaces sind nur für Benutzer mit entsprechender Berechtigung zugänglich.'
    },
    accessibility: 'Zugänglichkeit',
    addItem: 'ARTIKEL HINZUFÜGEN',
    path: 'Pfad',
    paths: 'Pfade',
    private: 'PRIVAT',
    imi: 'Institut für Medizininformatik',
    dragAndDrop: 'einfach ziehen und ablegen',
    metaData: 'Meta Daten',
    status: 'Status',
    noItems: 'Keine Artikel verfügbar',
    addNamespaces: 'Fügen Sie neue Namespaces hinzu, indem Sie auf die Schaltfläche ERSTELLEN klicken',
    type: 'Typ',
    login: 'EINLOGGEN',
    namespace: 'Namespace',
    identifier: 'Identifier',
    revision: 'Revision',
    urn: 'URN',
    namespaceIdentifier: 'NAMESPACE IDENTIFIER',
    elementIdentifier: 'ELEMENT IDENTIFIER',
    elementVersion: 'ELEMENT VERSION',
    elementType: 'Element Type',
    hidden: 'Hidden',
    property: 'Property',
    properties: 'Eigenschaften',
    of: 'von',
    cancel: 'Abbrechen',
    definition: 'Definition',
    definitions: 'Definitions',
    designation: 'Designation',
    designations: 'Designations',
    slot: 'Slot',
    slots: 'Slots',
    valueDomain: 'Value Domain',
    valueDomains: 'Value Domains',
    valueDomainNotEditable: 'Value Domains kann im Moment nicht bearbeitet werden.',
    language: 'Language',
    languages: 'Languages',
    name: 'Name',
    value: 'Wert',
    prefix: 'Präfix',
    baseUrl: 'Base-URL',
    relation: 'Beziehung',
    relations: 'Beziehungen',
    yes: 'Ja',
    no: 'Nein',
    searchText: 'Suche Text',
    elementTypes: 'Element Typen',
    elementStatuses: 'Element status',
    filter: 'Ergebnisse filtern ...',
    notYetImplemented: 'Noch nicht implementiert ...',
    system: 'System',
    text: 'Text',
    term: 'Begriff',
    linkType: 'Link-Typ',
    version: 'Version',
    conceptAssociation: 'Concept Association',
    conceptAssociations: 'Concept Associations',
    member: 'Member',
    members: 'Members',
    logout: 'Ausloggen',
    regEx: 'RegEx',
    minimum: 'Minimum',
    maximum: 'Maximum',
    range: 'Bereich',
    maximumLength: 'Maximale Länge',
    date: 'Datum',
    time: 'Zeit',
    hourFormat: 'Uhr-Format',
    frontend: 'Frontend',
    backend: 'Backend',
    address: {
      name1: 'Universitätsklinikum Frankfurt',
      name2: 'Medical Informatics Group (MIG)',
      additionToAddress: 'Haus 33C 2 OG R216-R220',
      street: 'Theodor-Stern-Kai 7',
      zip: '60590',
      city: 'Frankfurt',
      web: 'https://www.mig-frankfurt.de'
    },
    table: {
      header: {
        id: 'Identifier',
        actions: 'Actions'
      },
      loading: 'Daten werden geladen. Bitte warten ...'
    },
    unreleasedMembersDialog: {
      message1: 'Released Groups und Records können nur released' +
        ' members enthalten!',
      message2: 'Bitte releasen Sie diese Memebrs zuerst:'
    },
    itemDialog: {
      deleteItemTitle: 'Sind Sie sicher, dass Sie diesen Artikel Element möchten?',
      snackbar: {
        deleteFailure: 'Dieses Element konnte nicht gelöscht werden',
        deleteSuccess: 'Element gelöscht!',
        saveFailure: 'Dieses Element konnte nicht gespeichert werden',
        saveSuccess: 'Element gespeichert!'
      }
    },
    select: {
      namespace: 'Wählen Sie ein Namespace ...',
      valueDomain: 'Wählen Sie ein Value Domain ...'
    },
    form: {
      validation: {
        messages: {
          requiredField: 'Dieses Feld ist erforderlich',
          definitionRequired: 'Definition ist erforderlich',
          designationRequired: 'Designation ist erforderlich',
          languageRequired: 'Language ist erforderlich',
          regExRequired: 'RegEx ist erforderlich',
          maximumLengthRequired: 'Maximale Länge ist erforderlich',
          minimumRequired: 'Minimum ist erforderlich',
          maximumRequired: 'Maximum ist erforderlich',
          unitOfMeasureRequired: 'Maßeinheit ist erforderlich',
          valueIsRequired: 'Wert ist erforderlich',
          namespaceIsRequired: 'Namespace ist erforderlich',
          nameIsRequired: 'Name ist erforderlich',
          maxChars: 'Maximum Chars überschritten'
        }
      },
      placeholder: {
        date: 'Datum eingeben',
        time: 'Uhrzeit eingeben',
        hourFormat: 'Uhrzeitformat eingeben',
        regEx: 'RegEx eingeben',
        maximumLength: 'Maximale Länge eingeben',
        minimum: 'Minimum eingeben',
        maximum: 'Maximum eingeben',
        value: 'Wert eingeben'
      },
      label: {
        useRegEx: 'RegEx verwenden',
        useMaximumLength: 'Maximale Länge verwenden',
        useMinimum: 'Minimum verwenden',
        useMaximum: 'Maximum verwenden',
        unitOfMeasure: 'Maßeinheit'
      }
    }
  },
  pages: {
    home: {
      introduction: 'Das DataElementHub',
      dehub: 'Der zentrale Einstiegspunkt für menschliche Benutzer und Maschinen zum Speichern, Verwalten und Abrufen von Datenelement-Spezifikationen.',
      1: 'Syntaktische und semantische Interoperabilität zwischen Datenquellen mit unterschiedlicher Struktur und Formalisierung.',
      2: 'Teilweise Implementierung von ISO 11179-3 und ISO 21526 mit Schwerpunkt auf Anwendungsfällen im Gesundheitswesen und in der medizinischen Forschung.',
      3: 'Die in DEHub gespeicherten Metadaten tragen dazu bei, dass die Spezifikationen der Datenelemente und damit die jeweiligen Datensammlungen auch für Dritte langfristig zugänglich sind.',
      4: 'Das DEHub soll eine zentrale Komponente sein, die flexibel für unterschiedliche Anwendungsszenarien eingesetzt werden kann, aber dennoch die Anforderungen an eine strukturierte und qualitätsgesicherte Sammlung von Metadaten erfüllt.'
    },
    namespaces: {
      title: 'Namespaces',
      subtitle: '',
      itemDialog: {
        title: {
          create: 'Namespace Erstellen',
          update: 'Namespace updaten'
        },
        form: {
          publicNamespace: 'Öffentlicher Namespace',
          hiddenNamespace: 'Privater Namespace'
        }
      },
      actions: {
        createNamespace: 'Namespace Erstellen'
      },
      table: {
        header: {
          designation: 'Designation',
          revision: 'Revision',
          status: 'Status'
        }
      },
      grantedNamespacesReadSubtitle: 'Readable Namespaces',
      grantedNamespacesWriteSubtitle: 'Writeable Namespaces',
      grantedNamespacesAdminSubtitle: 'Admin Namespaces',
      messages: {
        namespaceCreated: 'Namespace wurde erstellt'
      }
    },
    dataElements: {
      title: 'Data Elements',
      subtitle: '',
      itemDialog: {
        title: {
          create: 'Data Element Erstellen',
          update: 'Data Element Updaten'
        }
      },
      actions: {
        createDataElement: 'Datenelement Erstellen'
      },
      grantedDataElements: 'Verfügbare Data Elements',
      messages: {
        dataElementSaved: 'Data Element wurde erstellt'
      }
    },
    groups: {
      title: 'Data Element Groups',
      subtitle: '',
      itemDialog: {
        title: {
          create: 'Data Element Group Erstellen',
          update: 'Data Element Group Updaten'
        }
      },
      actions: {
        createDataElementGroup: 'Data Element Group Erstellen'
      },
      grantedDataElementGroups: 'Verfügbare Data Element Groups',
      messages: {
        dataElementGroupSaved: 'Data Element Group wurde erstellt'
      }
    },
    records: {
      title: 'Records',
      subtitle: '',
      itemDialog: {
        title: {
          create: 'Record Erstellen',
          update: 'Record Updaten'
        }
      },
      actions: {
        createRecord: 'Record Erstellen'
      },
      grantedRecords: 'Verfügbare Records',
      messages: {
        recordSaved: 'Record wurde gespeichert'
      }
    },
    valueSets: {
      title: 'Value Sets',
      subtitle: ''
    },
    workspace: {
      staging: {
        title: 'Staging Elements',
        subtitle: ''
      },
      drafts: {
        title: 'Drafts',
        subtitle: ''
      },
      validate: {
        title: 'Validate',
        subtitle: ''
      }
    },
    view: {
      myData: {
        title: 'My Data',
        subtitle: ''
      },
      public: {
        title: 'Public Data',
        subtitle: ''
      },
      valueSets: {
        title: 'Value Sets',
        subtitle: ''
      }
    },
    tools: {
      namespaceComparison: {
        title: 'Namespace Vergleich',
        subtitle: ''
      },
      mapping: {
        title: 'Mapping',
        subtitle: ''
      },
      visualizer: {
        title: 'Visualizer',
        subtitle: ''
      },
      importExport: {
        title: 'Import & Export',
        subtitle: ''
      },
      search: {
        title: 'Search',
        subtitle: '',
        elementSections: 'Element sections',
        searchResult: 'Search result'
      }
    },
    settings: {
      title: 'Einstellungen',
      subtitle: ''
    },
    about: {
      title: 'Über das Data Element Hub',
      subtitle: ''
    },
    help: {
      title: 'Hilfe',
      subtitle: ''
    },
    login: {
      title: 'Anmeldung',
      introduction: 'Das DataElementHub',
      dehub: 'Der zentrale Einstiegspunkt für menschliche Benutzer und Maschinen zum Speichern, Verwalten und Abrufen von Datenelement-Spezifikationen.',
      1: 'Syntaktische und semantische Interoperabilität zwischen Datenquellen mit unterschiedlicher Struktur und Formalisierung.',
      2: 'Teilweise Implementierung von ISO 11179-3 und ISO 21526 mit Schwerpunkt auf Anwendungsfällen im Gesundheitswesen und in der medizinischen Forschung.',
      3: 'Die in DEHub gespeicherten Metadaten tragen dazu bei, dass die Spezifikationen der Datenelemente und damit die jeweiligen Datensammlungen auch für Dritte langfristig zugänglich sind.',
      4: 'Das DEHub soll eine zentrale Komponente sein, die flexibel für unterschiedliche Anwendungsszenarien eingesetzt werden kann, aber dennoch die Anforderungen an eine strukturierte und qualitätsgesicherte Sammlung von Metadaten erfüllt.',
      infoAlert: {
        text: 'Um das DEHub nutzen zu können, müssen Sie sich gegen eine <abbr title="Single Sign On">SSO Server</abbr> authentifizieren. Die aktuelle <abbr title="Single Sign On">SSO Server</abbr> wird von der Medical Informatics Group (MIG) betrieben.'
      },
      loginButton: 'Klicken Sie hier, um sich mit SSO anzumelden'
    }
  }
}
