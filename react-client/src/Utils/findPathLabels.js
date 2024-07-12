const findPathLabels = (siteMap, segments, parentPath = "") => {

    let paths = [];
    
    for (const page of siteMap) {
        const currentPath = `${parentPath}/${page.path}`;
        if (segments.includes(page.path)) {
            paths.push({ label: page.label, to: currentPath, link: page.link });

            if (page.children && segments.length > 0) {
                paths = paths.concat(findPathLabels(page.children, segments, currentPath));
            }

            segments.shift();
        }
    }
    return paths;
};

export default findPathLabels;