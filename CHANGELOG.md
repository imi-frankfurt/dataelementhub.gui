# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2022-11-03
### Added
- Add conceptAssociations to dataElement dialog [https://github.com/imi-frankfurt/dataelementhub.gui/issues/1]
  - This allows users to add and edit conceptAssociations while creating or editing a data element using the data element dialog.
- Add about and help pages [https://github.com/imi-frankfurt/dataelementhub.gui/issues/4]
- Update treeView after adding, editing or deleting an element [https://github.com/imi-frankfurt/dataelementhub.gui/issues/8]
  - This feature keeps the main view up to date and starts an auto-refresh when the treeView changes.
- Add definition table to group detail view [https://github.com/imi-frankfurt/dataelementhub.gui/issues/14]
  - This allows users to view all available definitions for a specified data element group or record. 
- Update dataElementGroup members [https://github.com/imi-frankfurt/dataelementhub.gui/issues/33]
  - This allows updating all data element group members to the newest available version. If the data element group contains sub data element groups, their members will be updated too.
- Add permittedValues table [https://github.com/imi-frankfurt/dataelementhub.gui/issues/38]
  - This allows  users to view all available permittedValues for a specified enumeratedValueDomain.
- Add scrollbar to the treeView [https://github.com/imi-frankfurt/dataelementhub.gui/issues/41]
  - This allows scrolling the treeView separately from the mainView.
- Translate the dehub to german [https://github.com/imi-frankfurt/dataelementhub.gui/issues/42]
  - This feature allows choosing german as navigation language.
- Add slots table to dataElementGroup detail view [https://github.com/imi-frankfurt/dataelementhub.gui/issues/64]
  - This allows users to view all available slots for a specified data element group or record.

### Changed
- Adjust definitions structure [https://github.com/imi-frankfurt/dataelementhub.gui/issues/11]
  - dehub.rest was updated to release 1.1.0, see [dehub.rest changelog](https://github.com/imi-frankfurt/dataelementhub.rest/blob/master/CHANGELOG.md) for changes
- Public namespaces require no login [https://github.com/imi-frankfurt/dataelementhub.gui/issues/19]
  - Grant access to public namespaces for all users(No token required). Only read scope is provided in this case.
- Hide subElements in main view [https://github.com/imi-frankfurt/dataelementhub.gui/issues/25]
  - For better navigation experience show grouped elements only in their assigned data element groups or records and hide them in the namespace node.
- Redesign detailViews [https://github.com/imi-frankfurt/dataelementhub.gui/issues/40]
  - Single click on a parent element in the element path shows its detail view with a button to navigate to the selected element in the tree view.
  - Update the general design for better usability.
- Design makeover [https://github.com/imi-frankfurt/dataelementhub.gui/issues/47]
  - Apply the color scheme.
- Update the treeView completely from the backend [https://github.com/imi-frankfurt/dataelementhub.gui/issues/49]
  - After every change in the tree view all nodes are used to be updated using implemented logic in the frontend, but now nodes update according to the implemented logic in the backend.
- Auto release valueDomain with its associated dataElement [https://github.com/imi-frankfurt/dataelementhub.gui/issues/62]
  - Since a released value domain is a requirement for releasing data elements. This feature releases the value domain automatically with its associated data element.
- Record members should not be editable if the record is released [https://github.com/imi-frankfurt/dataelementhub.gui/issues/74]
- Allow updating dataElementGroups even if they contain outdated members [https://github.com/imi-frankfurt/dataelementhub.gui/issues/76]
  - A data element group update was forbidden if one of its members is outdated.  
- Design improvements [https://github.com/imi-frankfurt/dataelementhub.gui/issues/82]
  - Make the design more user friendly.
- Set maxWidth to the table of dataElementGroup members [https://github.com/imi-frankfurt/dataelementhub.gui/issues/88]
- Set maxWidth to the table of enumerated valueDomains [https://github.com/imi-frankfurt/dataelementhub.gui/issues/90]
- Update the help page [https://github.com/imi-frankfurt/dataelementhub.gui/issues/94]
  - Add FAQ table and some helpful information.
- Update the about page [https://github.com/imi-frankfurt/dataelementhub.gui/issues/96]
  - Add links to source code and visualize the current setup.
- Update the home page [https://github.com/imi-frankfurt/dataelementhub.gui/issues/103]
  - Delete the description text to replace it later with more customized text.
- Design improvements [https://github.com/imi-frankfurt/dataelementhub.gui/issues/107]
  - Update GitHub links in the about page

### Deprecated
### Removed
- Remove unused code [https://github.com/imi-frankfurt/dataelementhub.gui/issues/84]

### Fixed
- Groups members are not loaded properly [https://github.com/imi-frankfurt/dataelementhub.gui/issues/2]
  - Groups members had to be refreshed manually after every change.
- Clear dialogs after closing them [https://github.com/imi-frankfurt/dataelementhub.gui/issues/6]
  - Element dialogs kept filled out after closing them.
- Backend messages are not shown properly [https://github.com/imi-frankfurt/dataelementhub.gui/issues/13]
  - Backend messages was visible only in the console.
- Element activation in treeView is not working properly [https://github.com/imi-frankfurt/dataelementhub.gui/issues/21]
  - In case an Element exists in two different sections in the treeView, activating the element and deactivating it again keeps it activated in the first section.
- Navigation drawer is not displayed properly [https://github.com/imi-frankfurt/dataelementhub.gui/issues/27]
  - The navigation drawer was not optimized for all screen sizes.
- Add element button is not working properly [https://github.com/imi-frankfurt/dataelementhub.gui/issues/35]
  - The button was missing for some data element groups even if the write/admin grant was available.
- Outdated elements can be added as dataElementGroup members [https://github.com/imi-frankfurt/dataelementhub.gui/issues/36]
  - Outdated elements can be kept as members, but they are not allowed to be added to a data element group.
- DataElementGroup members are not visible in the update dialog [https://github.com/imi-frankfurt/dataelementhub.gui/issues/56]
  - Fetch current members, display them and allow editing them.
- Hide create edit and delete buttons for unLogged users [https://github.com/imi-frankfurt/dataelementhub.gui/issues/58]
  - Users with no token have only read grant for public namespaces, so they are not allowed to edit or delete any elements.
- Public namespaces are saved as hidden [https://github.com/imi-frankfurt/dataelementhub.gui/issues/66]
- OUTDATED elements are not allowed to be edited [https://github.com/imi-frankfurt/dataelementhub.gui/issues/68]
  - Remove the edit button for outdated elements because they are not allowed to be edited.
- Available Element paths are not displayed in the search view [https://github.com/imi-frankfurt/dataelementhub.gui/issues/70]
  - Element paths are an essential part of the detail view, therefore they have to be displayed.
- Releasing members from the dataElementGroup dialog leads to errors [https://github.com/imi-frankfurt/dataelementhub.gui/issues/78]
- Time and enumerated value domains are not passing backend validation [https://github.com/imi-frankfurt/dataelementhub.gui/issues/80]

### Security
- Allow to set OAuth ClientID via ENV [https://github.com/imi-frankfurt/dataelementhub.gui/issues/29]
- Secure cookies [https://github.com/imi-frankfurt/dataelementhub.gui/issues/53]
  - Set auth cookies to secure and httpOnly.
- Handle invalid token [https://github.com/imi-frankfurt/dataelementhub.gui/issues/72]
  - If the token is expired, redirect users to the login page.
- Update dependencies [https://github.com/imi-frankfurt/dataelementhub.gui/issues/86]

## [1.0.0-alpha] - 2021-09-30
### Added
- Add a view containing all elements
- Add detail view to describe all element parts
- Enable the navigation to parent elements from the detail view
- Enable creating, deleting and editing elements
- Enable releasing dataElementGroup members from the dataElementGroup dialog
- Add search functionality
### Changed
### Deprecated
### Removed
### Fixed
### Security
