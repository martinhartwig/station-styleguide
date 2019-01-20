/* cf. http://stackoverflow.com/a/31632215 */
module.exports = {
    isNavActive: function (navTitle, activeTitle1, activeTitle2) {
        return (activeTitle1 && activeTitle1 === navTitle) || (!activeTitle1 && activeTitle2 === navTitle);
    }
};