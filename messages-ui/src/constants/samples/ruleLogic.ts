export const RULE_LOGIC_SAMPLES = {
  rules: `{
  "and": [
    { ">": [{ "var": "temp" }, 110] },
    { "<": [{ "var": "temp" }, 130] }
  ]
}`,

  data: `{
  "temp": 120
}`,
};