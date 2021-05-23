const sanitise = (string) => {
    return string.
    replace('&', '&amp;').
    replace('<', '&lt;').
    replace('>', '&gt;').
    replace('\'', '&apos;').
    replace('\"', '&quot;').
    replace('\n','<br>')
}
module.exports = sanitise;