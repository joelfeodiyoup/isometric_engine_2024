## The canvases

- **base** - the base colours.
- **grid** - the lines which form a kind of grid mesh. Not filled.
- **hover** - renders some indication of where the user is hovering the mouse. E.g. a transparent fill of a cell, or a circle indicating the point they're nearest
- **build** - probably images that are placed into cells. E.g. an image of a tree, or a building.
- **mouse-handler** - contains no rendering. Just used for click handlers, to get the correct x/y coordinates. Always the last/highest canvas element.