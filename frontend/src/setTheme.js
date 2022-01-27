const setTheme = (headerColor, folderStruckColor, mainSectionColor, logoutColor, logoutHoverColor, logoutHoverBackgroundColor, iconColor, fileUploadPopupColor, fileUploadPopupBackgroundColor, folderBackgroundColor, folderColor, folderBackgroundColorHover, color2, nameColor) => {
    const r = document.querySelector(':root');
    r.style.setProperty('--header-color', headerColor);
    r.style.setProperty('--folder-struct-color', folderStruckColor);
    r.style.setProperty('--main-section-color', mainSectionColor);
    r.style.setProperty('--logout-color', logoutColor);
    r.style.setProperty('--logout-hover-color', logoutHoverColor);
    r.style.setProperty('--logout-hover-background-color', logoutHoverBackgroundColor);
    r.style.setProperty('--icon-color', iconColor);
    r.style.setProperty('--file-upload-popup-color', fileUploadPopupColor);
    r.style.setProperty('--file-upload-popup-background-color', fileUploadPopupBackgroundColor);
    r.style.setProperty('--folder-background-color', folderBackgroundColor);
    r.style.setProperty('--folder-color', folderColor);
    r.style.setProperty('--folder-background-color-hover', folderBackgroundColorHover);
    r.style.setProperty('--color-2', color2);
    r.style.setProperty('--name-color', nameColor);
}

export default setTheme;