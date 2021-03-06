export default theme => ({
  input: {
    boxSizing: "border-box",
    fontSize: theme.fontSizes[1],
    fontWeight: theme.fontWeights.light,
    lineHeight: theme.lineHeights[2],
    fontFamily: theme.fonts.body,
    padding: `0 ${theme.space[4]}`,
    color: theme.colors.black,
    width: "100%",
    height: "48px",
    border: 0,
    margin: 0,
    MozAppearance: "textfield" // Hides the input="number" spin buttons in Firefox
  },
  "input:focus": {
    outline: 0,
    borderRadius: theme.radii[0],
    boxShadow: theme.shadows.focus
  },
  "input.webkitSpinButton": {
    display: "none" // Hides the input="number" spin buttons in Chrome
  },
  "input.default": {
    backgroundColor: theme.colors.grey.t05
  },
  "input.white": {
    backgroundColor: theme.colors.white
  }
});
